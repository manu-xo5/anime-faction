function fetchMorePosts(end_cursor) {
  const query_hash = '7c8a1055f69ff97dc201e752cf6f0093';
  return new Promise(async (resolve, reject) => {
    try {
      const jsonBody = await fetch(
        `https://www.instagram.com/graphql/query/?query_hash=${query_hash}&variables=%7B%22id%22%3A%2234690256339%22%2C%22first%22%3A12%2C%22after%22%3A%22${end_cursor}%22%7D`
      );
      const res = await jsonBody.json();
      resolve(res);
    } catch (er) {
      reject(er);
    }
  });
}

function fetchPostData(shortcode) {
  const query_hash = '552bb33f4e58c7805d13d4f95da7d3a1';
  return new Promise(async (resolve, reject) => {
    try {
      const jsonBody = await fetch(
        `https://www.instagram.com/graphql/query/?query_hash=${query_hash}&variables=%7B%22shortcode%22%3A%22${shortcode}%22%2C%22child_comment_count%22%3A3%2C%22fetch_comment_count%22%3A40%2C%22parent_comment_count%22%3A24%2C%22has_threaded_comments%22%3Atrue%7D`
      );
      const res = await jsonBody.json();
      resolve(res);
    } catch (error) {
      reject(error);
    }
  });
}

export { fetchMorePosts, fetchPostData };
