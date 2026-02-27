/**
 *
 */
Ext.onReady(function () {




    var gridPage = Ext.create('Ext.ux.ui.GridPage', {
        i18nblock: i18n.getKey('remotesurcharge'),
        block: 'remotesurcharge',

        editPage: 'edit.html',

        gridCfg: {
            store: Ext.data.StoreManager.lookup('remoteSurchargeStore'),
            columns: [{
                text: i18n.getKey('shippingMode'),
                dataIndex: 'shippingMode',
                itemId: 'shippingMode'
            }, {
                text: i18n.getKey('countryCode'),
                dataIndex: 'country',
                itemId: 'countryCode',
                renderer: function (value, metadata, record) {
                    return value.name;
                }
            }, {
                text: i18n.getKey('startPostcode'),
                dataIndex: 'startPostcode',
                itemId: 'startPostcode'
            }, {
                text: i18n.getKey('endPostcode'),
                dataIndex: 'endPostcode',
                itemId: 'endPostcode'
            }, {
                text: i18n.getKey('startOrderAmount'),
                dataIndex: 'startOrderAmount',
                itemId: 'startOrderAmount',
                width: 130
            }, {
                text: i18n.getKey('endOrderAmount'),
                dataIndex: 'endOrderAmount',
                itemId: 'endOrderAmount',
                width: 130
            }, {
                text: i18n.getKey('firstWeight'),
                dataIndex: 'firstWeight',
                itemId: 'firstWeight'
            }, {
                text: i18n.getKey('firstFee'),
                dataIndex: 'firstFee',
                itemId: 'firstFee'
            }, {
                text: i18n.getKey('plusWeight'),
                dataIndex: 'plusWeight',
                itemId: 'plusWeight'
            }, {
                text: i18n.getKey('plusFee'),
                dataIndex: 'plusFee',
                itemId: 'plusFee'
            }, {
                text: i18n.getKey('minCharge'),
                dataIndex: 'minCharge',
                itemId: 'minCharge'
            }, {
                text: i18n.getKey('status'),
                dataIndex: 'status',
                itemId: 'status'
            }]
        },
        filterCfg: { 
            items: [{
                name: 'shippingMode',
                xtype: 'combobox',
                fieldLabel: i18n.getKey('shippingMode'),
                itemId: 'shippingMode',
                store: new Ext.data.Store({
                    fields: ['name', 'id'],
                    data: [{
                        id: 'STANDARD',
                        name: 'Standard'
                    }, {
                        id: 'EXPRESS',
                        name: 'Express'
                    }]
                }),
                displayField: 'name',
                valueField: 'id'
            }, {
                useValueField: true,
                xtype: 'gridcombo',
                matchFieldWidth: true,
                itemId: 'countryCode',
                fieldLabel: i18n.getKey('countryCode'),
                name: 'countryCode',
                multiSelect: false,
                displayField: 'name',
                valueField: 'isoCode2',
                width: 380,
                labelWidth: 100,
                labelAlign: 'right',
                store: Ext.data.StoreManager.lookup('countryStore'),
                queryMode: 'remote',
                matchFieldWidth: false,
                pickerAlign: 'bl',
                gridCfg: {
                    store: Ext.data.StoreManager.lookup('countryStore'),
                    //					selModel : new Ext.selection.CheckboxModel({
                    //						checkOnly: true
                    //					}),
                    height: 200,
                    width: 380,
                    columns: [{
                        text: 'name',
                        width: 300,
                        dataIndex: 'name'
                        }],
                    bbar: Ext.create('Ext.PagingToolbar', {
                        store: Ext.data.StoreManager.lookup('countryStore'),
                        displayInfo: true,
                        displayMsg: 'Displaying {0} - {1} of {2}',
                        emptyMsg: i18n.getKey('noData')
                    })
                }
            }]
        }
    });
});