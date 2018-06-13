# Fall 2016 Assignment 3 Sample Solution used as reference


# ############## start 'index' page #######################

# Grab list of memos
def get_memos():
    memos = []
    rows = db().select(db.checklist.ALL, orderby=~db.checklist.updated_on)
    for i, r in enumerate(rows):
        t = dict(
            id=r.id,
            user_email=r.user_email,
            title=r.title,
            memo=r.memo,
            updated_on=r.updated_on,
            is_public=r.is_public
        )
        memos.append(t)
    return response.json(dict(
        memos=memos
    ))

# Add memo to database
@auth.requires_signature()
def add_memo():
    user_email = auth.user.email or None
    m_id = db.checklist.insert(memo=request.vars.memo)
    m = db.checklist(m_id)
    memo = dict(
            id=m.id,
            user_email=m.user_email,
            title=m.title,
            memo=m.memo,
            updated_on=m.updated_on,
            is_public=m.is_public
    )
    return response.json(dict(memo=memo))

# Edit a memo's content
@auth.requires_signature()
def edit_memo():
    memo = db(db.checklist.id == request.vars.id).select().first()
    memo.update_record(memo=request.vars.memo, title=request.vars.title)
    return dict()

# Delete a memo
@auth.requires_signature()
def del_memo():
    db(db.checklist.id == request.vars.memo_id).delete()
    return "ok"

# Toggle whether a memo is public
@auth.requires_signature()
def toggle_public():
    memo = db(db.checklist.id == request.vars.id).select().first()
    if(memo.is_public==True):
        memo.update_record(is_public=False)
    elif(memo.is_public==False):
        memo.update_record(is_public=True)
    return "ok"

# ################### End index Page #########################


# ################# Start 'musiclib' Page #######################

import tempfile

# Cloud-safe of uuid, so that many cloned servers do not all use the same uuids.
from gluon.utils import web2py_uuid

# Here go your api methods.

# To do:
# Form checking (check that the form is not empty when a new track is added)
# User checking
# Sharing

# Let us have a serious implementation now.

def build_track_url(i):
    return URL('api', 'play_track', vars=dict(track_id=i), user_signature=True)

@auth.requires_signature(hash_vars=False)
def get_tracks():
    start_idx = int(request.vars.start_idx) if request.vars.start_idx is not None else 0
    end_idx = int(request.vars.end_idx) if request.vars.end_idx is not None else 0
    tracks = []
    has_more = False
    rows = db().select(db.track.ALL, limitby=(start_idx, end_idx + 1))
    for i, r in enumerate(rows):
        if i < end_idx - start_idx:
            t = dict(
                id = r.id,
                tracklength = r.tracklength,
                bpm = r.bpm,
                title = r.title,
                num_plays = r.num_plays,
                track_url =  build_track_url(r.id),
            )
            tracks.append(t)
        else:
            has_more = True
    logged_in = auth.user is not None
    return response.json(dict(
        tracks=tracks,
        logged_in=logged_in,
        has_more=has_more,
    ))

@auth.requires_signature()
def get_insertion_id():
    insertion_id = web2py_uuid()
    return response.json(dict(
        insertion_id=insertion_id
    ))

@auth.requires_signature()
def add_track():
    """Received the metadata for a new track."""
    # Inserts the track information.
    t_id = db.track.insert(
        tracklength = request.vars.tracklength,
        bpm = request.vars.bpm,
        title = request.vars.title,
        num_plays = 0
    )
    # Then, updates the uploaded track to point to this track.
    db(db.track_data.id == request.vars.insertion_id).update(track_id=t_id)
    # Also, to clean up, remove tracks that do not belong to anyone.
    db(db.track_data.track_id == None).delete()
    # Returns the track info.  Building the dict should likely be done in
    # a shared function, but oh well.
    return response.json(dict(track=dict(
        id = t_id,
        tracklength = request.vars.tracklength,
        bpm = request.vars.bpm,
        title = request.vars.title,
        num_plays = 0,
        track_url = build_track_url(t_id)
    )))

@auth.requires_signature()
def del_track():
    "Deletes a track from the table"
    db(db.track.id == request.vars.track_id).delete()
    # The next line is likely useless, as this is taken care by SQL deletion cascading.
    db(db.track_data.track_id == request.vars.track_id).delete()
    return "ok"

# NOTE that we cannot hash the variables, otherwise we cannot produce the URL server-side.
@auth.requires_signature()
def upload_track():
    "Uploads the file related to a track"
    logger.info("_signature: %r", request.vars._signature)
    logger.info("Track insertion id: %r", request.vars.insertion_id)
    # First, we delete other incomplete uploads.
    db(db.track_data.track_id == None).delete()
    logger.info("Uploaded a file of type %r" % request.vars.file.type)
    if not request.vars.file.type.startswith('audio'):
        raise HTTP(500)
    # Inserts the new track.
    insertion_id = db.track_data.insert(
        track_id=None, # We don't know it yet.
        original_filename=request.vars.file.filename,
        data_blob=request.vars.file.file.read(),
        mime_type=request.vars.file.type,
        insertion_id=request.vars.insertion_id,
    )
    return response.json(dict(
        insertion_id=insertion_id
    ))

@auth.requires_signature()
def cleanup():
    """Removes incomplete uploads."""
    db(db.track_data.track_id == None).delete()


@auth.requires_signature()
def delete_music():
    """Deletes the file associated with a track, as we have uploaded a new one."""
    track_id = request.vars.track_id
    if track_id is None:
        raise HTTP(500)
    db(db.track_data.track_id == track_id).delete()
    return "ok"

@auth.requires_signature()
def play_track():
    track_id = int(request.vars.track_id)
    t = db(db.track_data.track_id == track_id).select().first()
    if t is None:
        return HTTP(404)
    headers = {}
    headers['Content-Type'] = t.mime_type
    # Web2py is setup to stream a file, not a data blob.
    # So we create a temporary file and we stream it.
    # f = tempfile.TemporaryFile()
    f = tempfile.NamedTemporaryFile()
    f.write(t.data_blob)
    f.seek(0) # Rewind.
    return response.stream(f.name, chunk_size=4096, request=request)

@auth.requires_signature()
def inc_plays():
    track_id = int(request.vars.track_id)
    t = db.track[track_id]
    t.update_record(num_plays = t.num_plays + 1)
    return "ok"

@auth.requires_signature()
def add_user_track():
    """Received the metadata for a new track."""
    # Inserts the track information.
    t_id = db.user_track.insert(
        tracklength = request.vars.tracklength,
        bpm = request.vars.bpm,
        liked_by = request.vars.liked_by,
        title = request.vars.title,
        num_plays = 0
    )
    # Then, updates the uploaded track to point to this track.
    db(db.track_data.id == request.vars.insertion_id).update(track_id=t_id)
    # Also, to clean up, remove tracks that do not belong to anyone.
    db(db.user_track_data.track_id == None).delete()
    # Returns the track info.  Building the dict should likely be done in
    # a shared function, but oh well.
    return response.json(dict(user_track=dict(
        id = t_id,
        tracklength = request.vars.tracklength,
        bpm = request.vars.bpm,
        title = request.vars.title,
        liked_by=request.vars.liked_by,
        num_plays = 0,
        track_url = build_track_url(t_id)
    )))

@auth.requires_signature()
def add_liked_track():
    """Received the metadata for a new track."""
    # Inserts the track information.
    t_id = db.liked_track.insert(
        liked_by = request.vars.liked_by,
        liked_title = request.vars.title
    )
    # Then, updates the uploaded track to point to this track.
    db(db.track_data.id == request.vars.insertion_id).update(track_id=t_id)
    # Also, to clean up, remove tracks that do not belong to anyone.
    db(db.user_track_data.track_id == None).delete()
    # Returns the track info.  Building the dict should likely be done in
    # a shared function, but oh well.
    return response.json(dict(user_track=dict(
        id = t_id,
        tracklength = request.vars.tracklength,
        bpm = request.vars.bpm,
        title = request.vars.title,
        liked_by=request.vars.liked_by,
        num_plays = 0,
        track_url = build_track_url(t_id)
    )))

def get_current_user():
    current_firstname=""
    current_lastname=""
    user_id = 0
    row = db(db.auth_user.id == auth.user.id).select()
    for i, r in enumerate(row):
        temp_user = dict(
            first_name=r.first_name,
            last_name=r.last_name,
            user_id=r.id
        )
        current_user = temp_user

    return response.json(dict(current_user=current_user))

# ################# end 'play' Page #######################




# ################# Start 'play' Page #######################




# ################ End 'play' Page ####################
