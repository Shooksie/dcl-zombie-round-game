CREATE OR REPLACE FUNCTION get_player_full_quest_completed_count(player_id_p text)
RETURNS setof player_quest_completed_count AS $$
    SELECT player_id, (COUNT(player_id))
        FROM (
            select 
                DATE_TRUNC ('day', created_at) AS date, 
                player_id,
                COUNT(is_bonus_reward_claimed) as count
            FROM player_quest_log
                where player_quest_log.is_bonus_reward_claimed = true 
                and player_id = player_id_p
            GROUP BY DATE_TRUNC('day', created_at), player_id) as Subq
        GROUP BY player_id;
$$ LANGUAGE sql STABLE;
