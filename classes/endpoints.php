<?php
class Redirect_Settings_Endpoints{
  
  public function __construct(){
    add_action('rest_api_init', array($this, 'init_endpoints'));
  }
  public function init_endpoints(){
    register_rest_route( 'gfoas/v1', '/redirect-settings', array(
			'methods' => 'GET',
			'callback' => 'Redirect_Settings_Endpoints::get_settings',
			'args'		=> []	
    ));
    register_rest_route( 'gfoas/v1', '/redirect-settings', array(
			'methods' => 'POST',
			'callback' => 'Redirect_Settings_Endpoints::update_settings',
			'args'		=> []	
    ));
    register_rest_route('gfoas/v1', 'get-posts-in-type', array(
      'methods' =>  'POST',
      'callback'=>  'Redirect_Settings_Endpoints::get_posts_in_type',
    ));
  }
  static function get_settings(){
    $res = [];
    //redirects
    $redirects = get_option('redirect_post_types');
    //post types
    $post_types = Redirect_Settings_Endpoints::get_post_type_list();
    //posts_in 
    $posts_in = Redirect_Settings_Endpoints::get_firsts_posts_per($post_types);

    $res['redirects'] = $redirects;
    $res['post_types'] = $post_types;
    $res['posts_in'] = $posts_in;
    $response = new WP_REST_Response($res);
	  $response->set_status(200); 
	  return $response;
  }
  static private function get_post_type_list(){
    $args = array(
    'public'   => true,
    );
    $output = 'names'; // 'names' or 'objects' (default: 'names')
    $operator = 'and'; // 'and' or 'or' (default: 'and')
    $post_types = [];
    $post_types_with_keys = get_post_types( $args, $output, $operator );
    foreach($post_types_with_keys as $key=>$name){
      $post_types[]=$name;
    }

    return $post_types;
  }

  static private function get_firsts_posts_per($post_types){
    $posts_in = [];
    foreach($post_types as $type){
      $posts = get_posts([
        'numberposts' => 10,
        'post_type'   => $type,
      ]);
      $posts_name_and_id = Redirect_Settings_Endpoints::format_posts($posts);
      $posts_in[$type] = $posts_name_and_id;
    }
    return $posts_in;
  }

  static function format_posts($posts){
    $posts_name_and_id = [];
    foreach($posts as $post){
      $posts_name_and_id[] = [
        'id'   => $post->ID,
        'name' => $post->post_title,
        'type' => $post->post_type
      ];
    }
    return $posts_name_and_id;
  }

  static function update_settings(){
    
    $is_logged_in = __validate_cookies($_COOKIE);
    if(!$is_logged_in) return json_encode(['err'=>'oops not logged in']);

    $json = file_get_contents('php://input');
    $data = json_decode($json);
    
    if(gettype($data)!=='array') return json_encode(['err'=>gettype($data)]);

    update_option('redirect_post_types', $data);

    $response = new WP_REST_Response(['data'=>'success']);
	  $response->set_status(200); 
	  return $response;
  }

  static function get_posts_in_type(){
    $json = file_get_contents('php://input');
    $data = json_decode($json);

    $type = $data->type;
    $search = $data->searchVal;

    $posts = get_posts([
      'numberposts' => 10,
      'post_type'   => $type,
      's' => $search,
    ]);
    $posts_name_and_id = Redirect_Settings_Endpoints::format_posts($posts);

    $response = new WP_REST_Response($posts_name_and_id);
	  $response->set_status(200); 
	  return $response;
  }

}


function __validate_cookies($cookies){
  $pattern = '/wordpress_logged_in_/';
  $keys = array_keys($cookies);
  $login_cookie = preg_grep($pattern, $keys)[0];
  if(!wp_validate_auth_cookie($cookie, 'logged_in')){
    return false;
  } else{
    return true;
  }   
}
