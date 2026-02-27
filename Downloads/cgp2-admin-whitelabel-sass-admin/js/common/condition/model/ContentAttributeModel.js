/**
 * @Description:
 * @author nan
 * @date 2023/10/12
 */
Ext.define('CGP.common.condition.model.ContentAttributeModel', {
    extend: 'Ext.data.Model',
    idProperty: 'key',//处理没指定时，会自动加上id字段,可以写别的
    fields: [
        /**
         * 上下文的key
         */
        {
            name: 'key',
            type: 'string'
        },
        //啥类型的上下文，skuAttribute,order,rtType，仅为描述作用
        {
            name: 'type',
            type: 'string'
        },
        {
            name: 'valueType',
            type: 'string'
        },
        {
            name: 'selectType',
            type: 'string'
        },
        //sku属性是可以选择那些选项显示启用的
        //现在这个字段存的是sku属性后里面属性有的选项，
        {
            name: 'attrOptions',
            type: 'array'
        },
        {
            name: 'required',
            type: 'string'
        },
        {
            name: 'attributeInfo',
            type: 'object'
        },
        {
            name: 'path',
            type: 'string',
            convert: function (value) {
                if (Ext.isEmpty(value)) {
                    console.warn('上下文路径配置path不允许为空')
                } else {
                    return value;
                }
            }
        },
        {
            name: 'displayName',
            type: 'string'
        },
        //上下文属性key的来源，是id还是code,
        // 还是其他类型，作为分组标识
        //目前值有skuId，skuCode,materialSpuName,
        {
            name: 'keyType',
            type: 'string',
            defaultValue: 'skuId'
        },
        //属性的分组显示名
        {
            name: 'keyTypeDisplay',
            type: 'string',
        },
        //sku属性id,不作为唯一标识
        {
            name: 'id',
            type: 'string'
        },
        //sku属性code
        {
            name: 'code',
            type: 'string'
        },
        //sku属性name
        {
            name: 'name',
            type: 'string'
        },
        //是否允许args转attrs格式
        {
            name: 'allowArgsToAttrs',
            type: 'boolean',
            defaultValue: true,
        },
        //是否为描述性属性
        {
            name: 'isDesc',
            type: 'boolean',
            useNull: true,
        },
        //是否为sku属性
        {
            name: 'isSku',
            type: 'boolean',
            useNull: true,
        },
    ],
})