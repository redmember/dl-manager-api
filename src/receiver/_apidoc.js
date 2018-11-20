
/**
 * @apiDefine BadRequest
 * @apiErrorExample {json} Error-BadRequest
 *  HTTP/1.1 400 Bad Request
 *  {
 *      "message": "Error Message"
 *  }
 */

/**
 * @apiDefine Unauthorized
 * @apiErrorExample {json} Error-Unauthorized
 *  HTTP/1.1 401 Unauthorized
 *  {
 *      "message": "Token Not Found" or
 *      "message": "Invaild Token" or
 *      "message": "Invaild iss" or
 *      "message": "Invaild sub" or
 *      "message": "Internal Error" or
 *      "message": "User Not Found"
 *  }
 */

/**
 * @apiDefine Forbidden
 * @apiErrorExample {json} Error-Forbidden
 *  HTTP/1.1 403 Forbidden
 *  {
 *      "message": "Permission Denied" or
 *      "message": "Privacy Blocked" or
 *      "message": "IP Address Blocked"
 *  }
 */

/**
 * @apiDefine NotFound
 * @apiErrorExample {json} Error-NotFound
 *  HTTP/1.1 404 Not Found
 *  {
 *      "message": "Error Message"
 *  }
 */

/**
 * @apiDefine SuccessNoBody
 * @apiSuccessExample Success-Response
 *  HTTP/1.1 200 OK
 */

/**
 * @apiDefine SuccessArray
 * @apiSuccessExample Success-Array-Response
 *  HTTP/1.1 200 OK
 *  [{
 *      Json String Array
 *  }]
 */

/**
 * @apiDefine Success
 * @apiSuccessExample Success-Response
 *  HTTP/1.1 200 OK
 *  {
 *      Json String
 *  }
 */

/**
 * @apiDefine HeaderContent
 * @apiHeaderExample {String} Header-Content-Type
 *  Content-Type: application/json
 */

/**
 * @apiDefine CommonCreateResponse
 * @apiErrorExample {json} Error-BadRequest
 *  HTTP/1.1 400 Bad Request
 *  {
 *      "message": "Error Message"
 *  }
 * @apiErrorExample {json} Error-NotFound
 *  HTTP/1.1 404 Not Found
 *  {
 *      "message": "Error Message"
 *  }
 */

/**
 * @apiDefine CommonReadResponse
 * @apiHeaderExample {String} Header-Content-Type
 *  Content-Type: application/json
 * @apiSuccessExample Success-Array-Response
 *  HTTP/1.1 200 OK
 *  [{
 *      Json String Array
 *  }]
 * @apiSuccessExample Success-Response
 *  HTTP/1.1 200 OK
 *  {
 *      Json String
 *  }
 * @apiErrorExample {json} Error-BadRequest
 *  HTTP/1.1 400 Bad Request
 *  {
 *      "message": "Error Message"
 *  }
 * @apiErrorExample {json} Error-NotFound
 *  HTTP/1.1 404 Not Found
 *  {
 *      "message": "Error Message"
 *  }
 */

/**
 * @apiDefine CommonUpdateResponse
 * @apiHeaderExample {String} Header-Content-Type
 *  Content-Type: application/json
 * @apiSuccessExample Success-Response
 *  HTTP/1.1 200 OK
 * @apiErrorExample {json} Error-BadRequest
 *  HTTP/1.1 400 Bad Request
 *  {
 *      "message": "Error Message"
 *  }
 * @apiErrorExample {json} Error-NotFound
 *  HTTP/1.1 404 Not Found
 *  {
 *      "message": "Error Message"
 *  }
 */
