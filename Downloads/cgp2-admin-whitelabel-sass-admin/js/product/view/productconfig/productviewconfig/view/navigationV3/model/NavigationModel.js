Ext.define('CGP.product.view.productconfig.productviewconfig.view.navigationV3.model.NavigationModel', {
    extend: 'Ext.data.Model',
    idProperty: 'id',
    fields: [
        {
            name: 'id',
            type: 'string'
        },
        {
            name: 'clazz',
            type: 'string'
        },
        {
            name: 'parent',
            type: 'object'
        },
        {
            name: 'description',
            type: 'string'
        }, {name: 'isLeaf', type: 'boolean'}, {
            name: 'leaf',
            type: 'boolean',
            convert: function (value, record) {
                return record.get('isLeaf');
            }
        }, {
            name: 'isOrderly',
            type: 'boolean'
        }, {
            name: 'navItemQuantityExpression',
            type: 'object'
        },
        {
            name: 'previewItem',
            type: 'object'
        },
        {
            name: 'index',
            type: 'number'
        },
        {
            name: 'displayNameKey',
            type: 'string'
        },
        {
            name: 'imagePath',
            type: 'string'
        },
        {
            name: 'targetSelector',
            type: 'object'
        }, {
            name: 'navItemIndexExpression',
            type: 'object'
        }, {
            name: 'displayNameExpression',
            type: 'object'
        },
        {
            name: 'showWhenPreview',
            type: 'boolean'
        }, {
            name: 'imagePathExpression',
            type: 'object'
        },
        {
            name: 'displayNameKeysExpression',
            type: 'object'
        },
        {
            //用于标识那几个导航项用用同一个图片库
            name: 'imageLibGroupId',
            type: 'string'
        }
    ]
});