/**
 * 角色model
 */
Ext.define('CGP.virtualcontainertype.model.VirtualContainerTypeModel', {
    extend: 'Ext.data.Model',
    idProperty: '_id',
    fields: [{
        name: '_id',
        type: 'string',
        useNull: true
    }, {
        name: 'clazz',
        type: 'string',
        defaultValue: 'com.qpp.cgp.domain.pcresource.virtualcontainer.VirtualContainerType'
    }, {
        name: 'description',
        type: 'string'
    }, {
        //repeat情况下没有模板配置
        name: 'template',
        type: 'object'
    }, {
        //repeat情况下，必须有指定字段的数据,该数据是每一个重复项的数据
        name: 'argumentType',
        type: 'object'
    }, {
        //repeat情况下，必须有，其他情况下可以有
        name: 'compile',
        type: 'object'
    }, {
        //repeat情况下，无该字段
        name: 'scopeFunc',
        type: 'object'
    }, {
        //repeat情况下，必须有字段,其他情形下无该字段
        name: 'layout',
        type: 'object'
    }, {
        //子VCT
        name: 'virtualContainerContents',
        type: 'array'
    }, {
        //固定化的VCT配置
        name: 'subVirtualContainerObjects',
        type: 'array'
    }, {
        //替换操作的配置
        name: 'virtualContainerPlaceholders',
        type: 'array'
    }, {
        name: 'displayName',
        type: 'string',
        convert: function (v, rec) {
            return '<' + rec.get('_id') + '>' + rec.get('description');
        }
    }
    ],
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/virtualContainerTypes',
        reader: {
            type: 'json',
            root: 'data'
        }
    }
});