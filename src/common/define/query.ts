export default {
  get_code_profession: 'select * from `tb_code_profession`',
  get_code_speciality: 'select * from `tb_code_speciality`',
  get_code_specialitycategory: 'select * from `tb_code_specialitycategory`',
  get_user_friend: 'select * from tb_user_friend\
    join tb_user_account on friend_seq = tb_user_account.account_seq\
    join tb_user_profession_code on friend_seq = tb_user_profession_code.account_seq\
    where tb_user_friend.account_seq = ?',
  get_user_friend__with_professionCode: 'select * from tb_user_friend\
    join tb_user_account on friend_seq = tb_user_account.account_seq\
    join tb_user_profession_code on friend_seq = tb_user_profession_code.account_seq\
    where tb_user_friend.account_seq = ? and profession_code = ?',
  get_user_messages: 'select seq,name as sender_name, sender_account_seq, company as sender_company, picture as sender_picture, profession_code as sender_profession_code, message, received_timestamp, is_new \
    from tb_user_message\
    join tb_user_account on sender_account_seq = tb_user_account.account_seq\
    join tb_user_profession_code on sender_account_seq = tb_user_profession_code.account_seq\
    where `received_account_seq` = ?\
    order by seq desc limit 20',
  get_user_messages__with_lastSeq: 'select seq,name as sender_name, sender_account_seq, company as sender_company, picture as sender_picture, profession_code as sender_profession_code, message, received_timestamp, is_new \
    from tb_user_message\
    join tb_user_account on sender_account_seq = tb_user_account.account_seq\
    join tb_user_profession_code on sender_account_seq = tb_user_profession_code.account_seq\
    where `received_account_seq` = ? and `seq` < ?\
    order by seq desc limit 20',
  get_user_message: 'select seq,name as sender_name, sender_account_seq, company as sender_company, picture as sender_picture, profession_code as sender_profession_code, message, received_timestamp, is_new\
    from tb_user_message\
    join tb_user_account on sender_account_seq = tb_user_account.account_seq\
    join tb_user_profession_code on sender_account_seq = tb_user_profession_code.account_seq\
    where `received_account_seq` = ? and `seq` = ?',
  get_user_message_lastSeq: 'select seq from tb_user_message where `received_account_seq` = ? order by seq asc limit 1',
  update_user_message_to_be_seen: 'update tb_user_message set is_new = 0 where `received_account_seq` = ? and `seq` = ?',
  get_user_info: 'select * from tb_user_account\
    join tb_user_profession_code using ( account_seq )\
    where account_seq = ?',
  get_user_speciality: 'select * from tb_user_account\
    left join tb_user_speciality_code using ( account_seq )\
    where account_seq = ?',
  update_user_account: 'update `tb_user_account` set ? where `account_seq` = ?',
  update_user_profession_code: 'update `tb_user_profession_code` set `profession_code` = ? where `account_seq` = ?',
  update_user_picture: 'update `tb_user_account` set `picture` = ? where `account_seq` = ?',
  delete_speciality_code: 'delete from `tb_user_speciality_code` where `account_seq` = ?',
  insert_user_speciality_code: 'insert into `tb_user_speciality_code` (`account_seq`, `speciality_code`) values ?',

};
