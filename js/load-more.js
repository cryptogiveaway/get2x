/**
 * Client-side scripting to enable dynamic "load more" of posts in archive lists.
 *
 * @package     makerDAO theme
 * @copyright   2019+ Stablecoin Integration Services
 */

jQuery.noConflict( $ );

jQuery( document ).ready( function ( $ ) {

  // WP localization parameters.
  // This contains information about the current loop.
  var params = makerdao_load_more_params;

  // The distance (in px) from the page bottom when you want to load more posts.
	var bottomOffset = 200;

  // Throttle the firing of scroll events.
  var scrollTimeoutFn = null;
  var scrollThrottleMs = 50;
  var loadingInProgress = false;
  var noMorePosts = false;

  $( window ).scroll( function() {

    if ( scrollTimeoutFn ) return;
    if ( loadingInProgress ) return;
    if ( noMorePosts ) return;

    scrollTimeoutFn = setTimeout( function () {

      if ( $( window ).scrollTop() >= ( $( document ).height() - $( window ).height() - bottomOffset ) ) {

        loadingInProgress = true;

        $.ajax({
          type : 'post',
          url : params.url,
          data : {
            'action': 'load_more',
            'query': params.query,
            'page' : params.page
          },
          error: function( data ) {
            console.error( data );
          },
          beforeSend : function ( xhr ) {
            $('#load-more-activity').text( params.label.loading_more || 'Loading more...' );
          },
          success : function( data ) {
            loadingInProgress = false;

            if ( data ) {
              params.page++;

              $( '#load-more-container' ).append( data );

              if ( params.page >= params.max_page ) {
                $( '#load-more-activity' ).text( params.label.no_more_posts || 'No more posts' );
                noMorePosts = true;
              }

            } else {
              $( '#load-more-activity' ).text( params.label.no_more_posts || 'No more posts' );
              noMorePosts = true;
            }

          }
        });

      }

      scrollTimeoutFn = null;
    }, scrollThrottleMs );

  } );

} );
