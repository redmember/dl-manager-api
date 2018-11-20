define({ "api": [
  {
    "type": "get",
    "url": "/v1/dl/dealers/:dealer_id/events",
    "title": "Get all event for dealer",
    "version": "1.0.0",
    "group": "Event",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "dealer_id",
            "description": "<p>딜러 아이디</p>"
          }
        ]
      }
    },
    "name": "Dealer",
    "permission": [
      {
        "name": "dealer"
      }
    ],
    "filename": "src/controllers/event.js",
    "groupTitle": "Event",
    "sampleRequest": [
      {
        "url": "http://api.dev.com:3101/v1/dl/dealers/:dealer_id/events"
      }
    ],
    "header": {
      "examples": [
        {
          "title": "Header-Content-Type",
          "content": "Content-Type: application/json",
          "type": "String"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Success-Array-Response",
          "content": "HTTP/1.1 200 OK\n[{\n    Json String Array\n}]",
          "type": "json"
        },
        {
          "title": "Success-Response",
          "content": "HTTP/1.1 200 OK\n{\n    Json String\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-BadRequest",
          "content": "HTTP/1.1 400 Bad Request\n{\n    \"message\": \"Error Message\"\n}",
          "type": "json"
        },
        {
          "title": "Error-NotFound",
          "content": "HTTP/1.1 404 Not Found\n{\n    \"message\": \"Error Message\"\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "get",
    "url": "/v1/dl/dealers/:dealer_id/sites/:site_id/events",
    "title": "Get all event for site",
    "version": "1.0.0",
    "group": "Event",
    "name": "Site",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "dealer_id",
            "description": "<p>딜러 아이디</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "site_id",
            "description": "<p>사이트 아이디</p>"
          }
        ]
      }
    },
    "permission": [
      {
        "name": "dealer"
      }
    ],
    "filename": "src/controllers/event.js",
    "groupTitle": "Event",
    "sampleRequest": [
      {
        "url": "http://api.dev.com:3101/v1/dl/dealers/:dealer_id/sites/:site_id/events"
      }
    ],
    "header": {
      "examples": [
        {
          "title": "Header-Content-Type",
          "content": "Content-Type: application/json",
          "type": "String"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Success-Array-Response",
          "content": "HTTP/1.1 200 OK\n[{\n    Json String Array\n}]",
          "type": "json"
        },
        {
          "title": "Success-Response",
          "content": "HTTP/1.1 200 OK\n{\n    Json String\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-BadRequest",
          "content": "HTTP/1.1 400 Bad Request\n{\n    \"message\": \"Error Message\"\n}",
          "type": "json"
        },
        {
          "title": "Error-NotFound",
          "content": "HTTP/1.1 404 Not Found\n{\n    \"message\": \"Error Message\"\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "post",
    "url": "/v1/dl/dealers/:dealer_id/members",
    "title": "Create a member",
    "version": "1.0.0",
    "group": "Member",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "dealer_id",
            "description": "<p>딜러 아이디</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "member_id",
            "description": "<p>멤버 아이디</p>"
          }
        ]
      }
    },
    "name": "Create",
    "permission": [
      {
        "name": "dealer"
      }
    ],
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 201 OK\n{\n    \"user_id\": Number\n}",
          "type": "json"
        }
      ]
    },
    "filename": "src/controllers/member.js",
    "groupTitle": "Member",
    "sampleRequest": [
      {
        "url": "http://api.dev.com:3101/v1/dl/dealers/:dealer_id/members"
      }
    ],
    "error": {
      "examples": [
        {
          "title": "Error-BadRequest",
          "content": "HTTP/1.1 400 Bad Request\n{\n    \"message\": \"Error Message\"\n}",
          "type": "json"
        },
        {
          "title": "Error-NotFound",
          "content": "HTTP/1.1 404 Not Found\n{\n    \"message\": \"Error Message\"\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "delete",
    "url": "/v1/dl/dealers/:dealer_id/members/:member_id",
    "title": "Delete a member",
    "version": "1.0.0",
    "group": "Member",
    "name": "Delete",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "dealer_id",
            "description": "<p>딜러 아이디</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "member_id",
            "description": "<p>멤버 아이디</p>"
          }
        ]
      }
    },
    "permission": [
      {
        "name": "dealer"
      }
    ],
    "filename": "src/controllers/member.js",
    "groupTitle": "Member",
    "sampleRequest": [
      {
        "url": "http://api.dev.com:3101/v1/dl/dealers/:dealer_id/members/:member_id"
      }
    ],
    "header": {
      "examples": [
        {
          "title": "Header-Content-Type",
          "content": "Content-Type: application/json",
          "type": "String"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response",
          "content": "HTTP/1.1 200 OK",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-BadRequest",
          "content": "HTTP/1.1 400 Bad Request\n{\n    \"message\": \"Error Message\"\n}",
          "type": "json"
        },
        {
          "title": "Error-NotFound",
          "content": "HTTP/1.1 404 Not Found\n{\n    \"message\": \"Error Message\"\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "get",
    "url": "/v1/dl/dealers/:dealer_id/members",
    "title": "Get all member",
    "version": "1.0.0",
    "group": "Member",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "dealer_id",
            "description": "<p>딜러 아이디</p>"
          }
        ]
      }
    },
    "name": "List",
    "permission": [
      {
        "name": "dealer"
      }
    ],
    "filename": "src/controllers/member.js",
    "groupTitle": "Member",
    "sampleRequest": [
      {
        "url": "http://api.dev.com:3101/v1/dl/dealers/:dealer_id/members"
      }
    ],
    "header": {
      "examples": [
        {
          "title": "Header-Content-Type",
          "content": "Content-Type: application/json",
          "type": "String"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Success-Array-Response",
          "content": "HTTP/1.1 200 OK\n[{\n    Json String Array\n}]",
          "type": "json"
        },
        {
          "title": "Success-Response",
          "content": "HTTP/1.1 200 OK\n{\n    Json String\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-BadRequest",
          "content": "HTTP/1.1 400 Bad Request\n{\n    \"message\": \"Error Message\"\n}",
          "type": "json"
        },
        {
          "title": "Error-NotFound",
          "content": "HTTP/1.1 404 Not Found\n{\n    \"message\": \"Error Message\"\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "get",
    "url": "/v1/dl/dealers/:dealer_id/sites",
    "title": "Get all site",
    "version": "1.0.0",
    "group": "Site",
    "name": "List",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "dealer_id",
            "description": "<p>딜러 아이디</p>"
          }
        ]
      }
    },
    "permission": [
      {
        "name": "dealer"
      }
    ],
    "filename": "src/controllers/site.js",
    "groupTitle": "Site",
    "sampleRequest": [
      {
        "url": "http://api.dev.com:3101/v1/dl/dealers/:dealer_id/sites"
      }
    ],
    "header": {
      "examples": [
        {
          "title": "Header-Content-Type",
          "content": "Content-Type: application/json",
          "type": "String"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Success-Array-Response",
          "content": "HTTP/1.1 200 OK\n[{\n    Json String Array\n}]",
          "type": "json"
        },
        {
          "title": "Success-Response",
          "content": "HTTP/1.1 200 OK\n{\n    Json String\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-BadRequest",
          "content": "HTTP/1.1 400 Bad Request\n{\n    \"message\": \"Error Message\"\n}",
          "type": "json"
        },
        {
          "title": "Error-NotFound",
          "content": "HTTP/1.1 404 Not Found\n{\n    \"message\": \"Error Message\"\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "put",
    "url": "/v1/dl/dealers/:dealer_id/sites/:site_id",
    "title": "Enable deep learning",
    "version": "1.0.0",
    "group": "Site",
    "name": "Update",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "dealer_id",
            "description": "<p>딜러 아이디</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "site_id",
            "description": "<p>사이트 아이디</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "allowedValues": [
              "0",
              "1"
            ],
            "optional": false,
            "field": "enable",
            "description": "<p>사용유무</p>"
          }
        ]
      }
    },
    "permission": [
      {
        "name": "dealer"
      }
    ],
    "filename": "src/controllers/site.js",
    "groupTitle": "Site",
    "sampleRequest": [
      {
        "url": "http://api.dev.com:3101/v1/dl/dealers/:dealer_id/sites/:site_id"
      }
    ],
    "header": {
      "examples": [
        {
          "title": "Header-Content-Type",
          "content": "Content-Type: application/json",
          "type": "String"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response",
          "content": "HTTP/1.1 200 OK",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-BadRequest",
          "content": "HTTP/1.1 400 Bad Request\n{\n    \"message\": \"Error Message\"\n}",
          "type": "json"
        },
        {
          "title": "Error-NotFound",
          "content": "HTTP/1.1 404 Not Found\n{\n    \"message\": \"Error Message\"\n}",
          "type": "json"
        }
      ]
    }
  }
] });
