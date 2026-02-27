Ext.define('CGP.product.view.productconfig.productviewconfig.view.viewconfigV2.model.NavigationModel', {
    extend: 'Ext.data.Model',
    idProperty: 'id',
    fields: [
        {
            name: 'id',
            type: 'number'
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
            name: 'useHistory',
            type: 'boolean'
        }, {
            name: 'navItemQuantityExpression',
            type: 'object'
        }, {
            name: 'verifyType',
            type: 'string'
        },
        {
            name: 'sortOrder',
            type: 'number'
        },
        {
            name: 'displayName',
            type: 'string'
        },
        {
            name: 'displayTitle',
            type: 'string'
        }, {
            name: 'targetSelector',
            type: 'object'
        }, {
            name: 'navItemIndexExpression',
            type: 'object'
        }, {
            name: 'displayNameExpreassion',
            type: 'object'
        }, {
            name: 'displayTitle',
            type: 'object'
        }, {
            name: 'displayContentExpression',
            type: 'object'
        }, {
            name: 'targetSelectorExpression',
            type: 'object'
        }, {
            name: 'dispatchEventExpression',
            type: 'object'
        },
        {
            name: 'editViewConfigData',
            type: 'object'
        }

    ]
});
