# Fall 2016 Assignment 3 Sample Solution used as reference

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