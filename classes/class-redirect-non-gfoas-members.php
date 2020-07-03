<?php
if(!class_exists( 'Redirect_Non_GFOAS_Members' )){
  class Redirect_Non_GFOAS_Members{
    
    function __construct(){
      $this->create_option_key();
      new Redirect_Options_Page();
      new Redirect_Post_Types();
    }
    private function create_option_key(){
      if(!get_option('redirect_post_types')){
        update_option('redirect_post_types');
      }
    }
  } //?class end
  
  new Redirect_Non_GFOAS_Members();
}



class Redirect_Options_Page {
  function __construct(){
    add_action('admin_enqueue_scripts', array($this, 'enqueue_all_admin_scripts'),1,1);
    add_action('admin_menu', array($this, 'register_page'));
    include_once REDIRECT_NON_GFOAS_MEMBERS_PATH . 'classes/endpoints.php';
    new Redirect_Settings_Endpoints();
  }

  public function register_page(){
    $slug = add_menu_page( 
      'Redirect Post Types and Posts', 
      'Guard Membership Types', 
      'manage_options',
      'redirect-gfoas-settings', 
      'Redirect_Options_Page::markup',
      '',
      25
    );
  }

  public function enqueue_all_admin_scripts($hook){
    if($hook == 'toplevel_page_redirect-gfoas-settings'){
      wp_enqueue_script( 'redirect-main-script', plugin_dir_url( dirname(__FILE__) ) . 'dist/main.js',  true );
      wp_enqueue_style('redirect-main-styles', REDIRECT_NON_GFOAS_MEMBERS_URL . 'dist/main.css', '1.00' , 'all');
      wp_localize_script( 
        'redirect-main-script', 
        'WP', 
        [
          'ajax'  =>  admin_url( 'admin-ajax.php' ),
        ]
      );
    }
  }

  static function markup(){
    include REDIRECT_NON_GFOAS_MEMBERS_PATH . '/ui/admin-page.php';
  }
}

class Redirect_Post_Types{
  function __construct(){
    add_action('template_redirect', array($this,'redirect'));
  }
  function redirect(){
    global $post;
    if(is_user_logged_in()){
      return;
    }
    
    $type = $post->post_type;
    $id = $post->ID;
    $redirects = get_option('redirect_post_types');

    $new_location = false;
    foreach($redirects as $redirect){
      if($redirect->type !== $type){
        continue;
      }
      
      if($redirect->guard_specific === true ){
        foreach( $redirect->posts_to_guard as $guarded_post ){
          
          if($guarded_post->id === $post->ID){ 
            $new_location = $redirect->redirects_to;
            header('Location: ' . $new_location); 
            exit;
          }
        }
        continue;
      }

      $new_location = $redirect->redirects_to;
      header('Location: ' . $new_location);
      exit;
    }

    return;//you are cleared to view this post
  }
}