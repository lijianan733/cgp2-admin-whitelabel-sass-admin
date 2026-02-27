/**
 * @Description:
 * @author nan
 * @date 2023/7/5
 */
Ext.define('CGP.promotion.model.Promotion', {
    extend: 'Ext.data.Model',
    idProperty: '_id',
    fields: [
        {
            name: '_id',
            type: 'string',
            useNull: true
        },
        {
            name: 'name',
            type: 'string',
        },
        {
            name: 'displayName',
            type: 'string',
        },
        {
            name: 'description',
            type: 'string',
        },
        //生效时间范围
        /**
         *  {
         *  "clazz": "com.qpp.cgp.domain.promotion.timeSpan.DurationTime",
         *   "startDate": 1688428800000,
         *    "endDate": 1688688000000
         *    }
         */
        {
            name: 'effectiveTime',
            type: 'object'
        },
        //生效的订单类型Sample
        {
            name: 'effectiveOrders',
            type: 'array',
        },
        //该优惠活动的状态，status:['effective', 'invalid']
        {
            name: 'status',
            type: 'string'
        },
        {
            name: 'isAutomatic',
            type: 'boolean'
        },
        //优惠活动的减免方式
        {
            name: 'promotionDiscount',
            type: 'array'
        },
        //优惠码或优化券列表
        {
            name: 'promotionTicket',
            type: 'array'
        },
        //活动限制
        {
            name: 'promotionLimitation',
            type: 'array'
        },
        {
            name: 'clazz',
            type: 'string',
            defaultValue: 'com.qpp.cgp.domain.promotion.PromotionConfig'
        },
        //生效环境Stage,Production
        {
            name: 'mode',
            type: 'string',
        },
    ],
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/promotion',
        reader: {
            type: 'json',
            root: 'data'
        }
    }
})
