<?php
/**
 * Plugin Name:Redirect Non GFOAS Members
 * Plugin URI: 
 * Description: redirects non logged in members from certain post types to landing pages or specified pages
 * Version: 1.0
 * Author: Outthink
 * Author URI: https://outthinkgroup.com
 */

define('REDIRECT_NON_GFOAS_MEMBERS_PATH', plugin_dir_path(__FILE__));
define('REDIRECT_NON_GFOAS_MEMBERS_URL', plugin_dir_url(__FILE__));

 add_action('init', function(){
   require REDIRECT_NON_GFOAS_MEMBERS_PATH . '/classes/class-redirect-non-gfoas-members.php';
 });
