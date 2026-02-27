/**
 * Created by nan on 2018/5/14.
 */
Ext.define('CGP.builderpublishhistory.model.BuliderPublishHistoryModel', {
    extend: 'Ext.data.Model',
    idProperty: '_id',
    fields: [
        {
            name: '_id',
            type: 'string'
        },
        {
            name: 'clazz',
            type: 'string',
            defaultValue: 'com.qpp.cgp.domain.dto.product.builder.BuilderPublishHistory'
        },
        {
            name: 'language',
            type: 'string'
        }
        ,
        {
            name: 'message',
            type: 'string'
        }
        ,
        {
            name: 'postStatus',
            type: 'string'
        }
        ,
        {
            name: 'preStatus',
            type: 'string'
        }
        ,
        {
            name: 'productConfigViewId',
            type: 'int'
        },
        {
            name: 'productConfigViewVersion',
            type: 'string'
        }
        ,
        {
            name: 'publishBy',
            type: 'int'

        },
        {
            name: 'publishDate',
            type: 'date',
            convert: function (value) {
                if (Ext.isEmpty(value)) {
                    return null;
                } else {
                    return new Date(value.epochSecond)
                }
            },
            serialize: function (value) {
                var time = value.getTime();
                return time;
            }
        },
        {
            name: 'success',
            type: 'boolean'
        },
        {
            name: 'username',
            type: 'string'
        },
        {
            name: 'builderConfigId',
            type: 'string'
        },
        {
            name: 'productId',
            type: 'int'
        }
    ]
})

