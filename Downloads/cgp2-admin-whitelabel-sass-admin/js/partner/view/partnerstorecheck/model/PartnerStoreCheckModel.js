/**
 * @author xiu
 * @date 2025/5/15
 */
Ext.define('CGP.partner.view.partnerstorecheck.model.PartnerStoreCheckModel', {
    extend: 'Ext.data.Model',
    idProperty: '_id',
    fields: [
        {
            name: 'store',
            type: 'object',
        },
        {
            name: 'partner',
            type: 'object',
        },
        {
            name: 'partnerId',
            type: 'int',
            useNull: true,
            convert: function (value, record) {
                var partner = record.get('partner');
                return partner ? partner['id'] : '';
            }
        },
        {
            name: '_id',
            type: 'int',
            useNull: true,
            convert: function (value, record) {
                var me = this,
                    store = record.get('store');
                return store ? store[me.name] : '';
            }
        },
        {
            name: 'clazz',
            type: 'string',
            convert: function (value, record) {
                var me = this,
                    store = record.get('store');
                return store ? store[me.name] : '';
            }
        },

        {
            name: 'createdDate',
            type: 'number',
            convert: function (value, record) {
                var me = this,
                    store = record.get('store');
                return store ? store[me.name] : '';
            }
        },
        {
            name: 'name',
            type: 'string',
            convert: function (value, record) {
                var me = this,
                    store = record.get('store');
                return store ? store[me.name] : '';
            }
        },
        {
            name: 'url',
            type: 'string',
            convert: function (value, record) {
                var me = this,
                    store = record.get('store');
                return store ? store[me.name] : '';
            }
        },
        {
            name: 'platform',
            type: 'object',
            convert: function (value, record) {
                var me = this,
                    store = record.get('store');
                return store ? store[me.name] : {};
            }
        },
        {
            name: 'shopOwner',
            type: 'object',
            convert: function (value, record) {
                var me = this,
                    store = record.get('store');
                return store ? store[me.name] : {};
            }
        },
        {
            name: 'status',
            type: 'string',
            convert: function (value, record) {
                var me = this,
                    store = record.get('store');
                return store ? store[me.name] : '';
            }
        },
        {
            name: 'authInfoToExternal',
            type: 'boolean',
            convert: function (value, record) {
                var me = this,
                    store = record.get('store');
                return store ? store[me.name] : false
            }
        },
        {
            name: 'authSuccessToExternal',
            type: 'boolean',
            convert: function (value, record) {
                var me = this,
                    store = record.get('store');
                return store ? store[me.name] : false
            }
        },
        {
            name: 'createWebhook',
            type: 'boolean',
            convert: function (value, record) {
                var me = this,
                    store = record.get('store');
                return store ? store[me.name] : false
            }
        },
        {
            name: 'currency',
            type: 'object',
            convert: function (value, record) {
                var me = this,
                    store = record.get('store');
                return store ? store[me.name] : {};
            }
        },
        {
            name: 'currencyCode',
            type: 'string',
            convert: function (value, record) {
                var me = this,
                    store = record.get('store');
                return store ? store[me.name] : '';
            }
        },
        {
            name: 'metaData',
            type: 'object',
            convert: function (value, record) {
                var me = this,
                    store = record.get('store');
                return store ? store[me.name] : {};
            }
        },
        {
            name: 'mode',
            type: 'string',
            convert: function (value, record) {
                var me = this,
                    store = record.get('store');
                return store ? store[me.name] : '';
            }
        },
        {
            name: 'needToUpgradePlugins',
            type: 'boolean',
            convert: function (value, record) {
                var me = this,
                    store = record.get('store');
                return store ? store[me.name] : false
            }
        },
        {
            name: 'currencyExceptionInfoList',
            type: 'array',
            convert: function (value, record) {
                var me = this,
                    store = record.get('store');
                return store ? store[me.name] : [];
            }
        },
        {
            name: 'storeProductUpgradeStatus',
            type: 'string',
            convert: function (value, record) {
                var me = this,
                    store = record.get('store');
                return store ? store[me.name] : '';
            }
        },


        {
            name: 'partnerName',
            type: 'string',
            convert: function (value, record) {
                var partner = record.get('partner');
                if (partner) {
                    var {name} = partner;

                    return name;
                }
            }
        },
        {
            name: 'billAddress',
            type: 'object',
            convert: function (value, record) {
                var me = this,
                    store = record.get('store');
                return store ? store[me.name] : {};
            }
        },
        {
            name: 'deliveryAddress',
            type: 'object',
            convert: function (value, record) {
                var me = this,
                    store = record.get('store');
                return store ? store[me.name] : {};
            }
        },
        {
            name: 'createdDate',
            type: 'date',
            convert: function (value, record) {
                var me = this,
                    store = record.get('store'),
                    createdDate = store ? store[me.name] : '';

                if (!createdDate) {
                    return null;
                } else {
                    return new Date(createdDate)
                }
            },
            serialize: function (value, record) {
                var me = this,
                    store = record.get('store'),
                    createdDate = store ? store[me.name] : '',
                    time = createdDate ? createdDate.getTime() : '';

                return time;
            }
        }
    ],
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/colors',
        reader: {
            type: 'json',
            root: 'data'
        }
    }
})
