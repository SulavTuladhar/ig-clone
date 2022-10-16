/**
 * maps request data with given obj
 * @params {object} user
 * @params {object} userData
 * @returns {object}
 */

 module.exports = function(post,postData){
    if(postData.caption)
        post.caption = postData.caption;
    if(postData.images)
        post.images = postData.images;
    if(postData.privacy)
        post.privacy = postData.privacy;
    return post; 
}