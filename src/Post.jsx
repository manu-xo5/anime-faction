import React, { useState, useEffect, useRef } from 'react';
import { fetchPosts, fetchMorePosts, fetchVideo } from './fetchPosts';
import './css/post.css'


function MainContent(props) {
  const { src, isVideo, shortcode } = props;
  const vplayer = useRef(null);
  const [videoURL, setVideoURL] = useState(null);
  const handleClick = () => {
    if (isVideo && videoURL == null)
      fetchVideo(shortcode, (res) => {
        setVideoURL(res.data.shortcode_media.video_url)
        vplayer.current.focus()
      })
  }

  return <div className='post-content' onClick={handleClick}>
    {videoURL
      ?
      <video
        onBlur={() => { vplayer.current.pause() }}
        src={videoURL}
        controls
        autoPlay
        loop={true}
        ref={vplayer}
      ></video>
      :
      <img src={src} alt="" />
    }
  </div>
}

function Caption(props) {
  const captions = props.captions.split('\n');
  const [showMore, setShowMore] = useState(false);
  return <div className="post-caption">
    {captions.slice(0, 2).map((text, index) => <p key={index}>{text}</p>)}
    {showMore ? captions.slice(2).map((text, index) => <p key={index}>{text}</p>) : null}
    <button
      className='show-more'
      onClick={() => setShowMore(state => !state)}
    >
      Show {!showMore ? "more" : 'less'}
    </button>
  </div>
}

function Rating(props) {
  const { isVideo, likes, comments, views } = props;
  return <div className="post-rating">
    <p>
      <span role='img' aria-label='likes' >❤️&nbsp;</span>
      Liked by&nbsp;
      <strong>{likes}</strong>
      <span className="seperator"></span>
      <span role='img' aria-label='likes' >💬&nbsp;</span>
      <strong>{comments}</strong>
      {isVideo && <><span className="seperator"></span>
        <span role='img' aria-label='likes' >🎥&nbsp;</span>
        <strong>{views}</strong></>}
    </p>
  </div>
}

function Post() {
  const [posts, setPosts] = useState({ edges: [] });
  useEffect(() => {
    fetchPosts(data => {
      setPosts(data);
    });
  }, []);

return <>
    <div className="container-post">
      {posts['edges'].map((_post, index) => {
        const post = _post.node;
        const captions = post.edge_media_to_caption.edges[0].node.text;
        return (
          <div className="post" key={index}>
            <MainContent
              src={post.thumbnail_src}
              isVideo={post.is_video}
              shortcode={post.shortcode}
            />
            <Rating
              isVideo={post.is_video}
              likes={post.edge_media_preview_like.count}
              comments={post.edge_media_to_comment.count}
              views={post.video_view_count}
            />
            <Caption captions={captions} />
          </div>
        );
      })}
    </div>
    <button
      className='load-more'
      onClick={() => {
        if (posts.page_info.has_next_page) fetchMorePosts(data => {
          const newEdges = [...posts.edges];
          data.edges.map(edge => newEdges.push(edge))

          const newState = {
            count: 218,
            page_info: data.page_info,
            edges: newEdges,
          }

          setPosts(newState)
        }, posts.page_info.end_cursor)
      }}
    ><span role='img' aria-label='load more'>👇</span> Load More</button>
  </>
}

export default Post;