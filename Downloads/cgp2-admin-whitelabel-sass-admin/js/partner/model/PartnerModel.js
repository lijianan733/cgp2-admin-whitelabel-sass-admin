Ext.define('CGP.partner.model.PartnerModel', {
    extend: 'Ext.data.Model',
    fields: [
        {
            name: 'id',
            type: 'int',
            useNull: true
        },
        {
            name: 'code',
            type: 'string'
        },
        {
            name: 'name',
            type: 'string'
        },
        {
            name: 'contactor',
            type: 'string'
        },
        {
            name: 'telephone',
            type: 'string'
        },
        {
            name: 'cooperationType',
            type: 'string'
        },
        {
            name: 'email',
            type: 'string'
        },
        {
            name: 'website',
            type: 'object'
        },
        {
            name: 'cooperationBusinesses',
            type: 'object',
            defaultValue: undefined
        },
        {
            name: 'settlementType',
            type: 'string'
        },
        {
            name: 'partnerType',
            type: 'string'
        },
        {
            name: 'userAuthInfos', 
            type: 'array',
        },
        {
            name: 'partnerStatus',
            type: 'string'
        },
        //订单初始状态
        {
            name: 'orderInitStatusId',
            type: 'number',
            useNull: true,
        },
        //注册日期
        {
            name: 'createdDate',
            type: 'string',
            convert: function (value) {
                if (Ext.isEmpty(value)) {
                    return null;
                } else {
                    return new Date(value)
                }
            },
            serialize: function (value) {
                var time = value?.getTime();
                return time;
            }
        },
        //注册来源
        {
            name: 'platform',
            type: 'string'
        },
        //订单默认备注
        {
            name: 'orderDefaultRemark',
            type: 'string'
        },
        /**
         * 是否需要订单超时取消
         */
        {
            name: 'needOrderTimeOutCancel',
            type: 'boolean',
            defaultValue: false,
        }
    ],
    proxy: {
        type: 'uxrest',
        allowMerge: true,//开启数据合并
        url: adminPath + 'api/partners',
        reader: {
            type: 'json',
            root: 'data'
        }
    }

})
