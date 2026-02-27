/**
 * MailHistory's model
 */
Ext.define('CGP.mailhistory.model.Model', {
    extend: 'Ext.data.Model',
    idProperty: '_id',
    fields: [{
        //id
        name: '_id',
        type: 'int',
        useNull: true
    }, {
        //主题
        name: 'subject',
        type: 'string'
    }, {
        //内容
        name: 'text',
        type: 'string'
    }, {
        //是否成功
        name: 'success',
        type: 'boolean'
    }, {
        //错误信息
        name: 'errorMessage',
        type: 'string'
    }, {
        name: 'from',
        type: 'string'
    }, {
        //收件人
        name: 'to',
        type: 'array'
    }, {
        //网站名字
        name: 'websiteId',
        type: 'int',
        serialize: function (value) {
            if (Ext.isEmpty(value)) {
                return [];
            }
            return value;
        }
    }, {
        name: 'mailSender',
        type: 'object'
    },
        {
            //附件
            name: 'attachments',
            type: 'array',
            convert: function (value) {//处理附件为null的情况
                if (Ext.isEmpty(value)) {
                    return [];
                }
                return value;
            }

        }, {
            //创建日期
            name: 'sendDate',
            type: 'date',

            /**
             *
             * @param value
             * @returns {Date}
             */
            convert: function (value) {
                return new Date(value)
            },
            /**
             *
             * @param value
             * @returns {number}
             */
            serialize: function (value) {
                var time = value.getTime();
                return time;
            }
        }],
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/mailHistories',
        reader: {
            type: 'json',
            root: 'data'
        }
    }
});
