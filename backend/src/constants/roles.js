export const USER_ROLES = {
  USER: 'user',
  MODERATOR: 'moderator',
  ADMIN: 'admin',
};

export const ROLE_PERMISSIONS = {
  user: [
    'create_mood',
    'read_own_mood',
    'create_journal',
    'read_own_journal',
    'create_post',
    'read_post',
    'like_post',
    'create_reply',
    'read_reply',
    'like_reply',
    'bookmark_post',
    'report_content',
  ],
  moderator: [
    'read_all_mood',
    'read_all_journal',
    'read_all_post',
    'read_all_reply',
    'moderate_post',
    'moderate_reply',
    'review_report',
    'respond_to_contact',
  ],
  admin: [
    'manage_users',
    'manage_content',
    'manage_reports',
    'manage_admins',
    'view_analytics',
    'view_dashboard',
    'system_settings',
  ],
};

export default USER_ROLES;