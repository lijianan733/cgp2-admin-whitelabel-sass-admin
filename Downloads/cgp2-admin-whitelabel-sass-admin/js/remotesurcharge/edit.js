/** 
 * 语言设置添加修改 的编辑页面ExtJS
 *
 */
Ext.onReady(function () {


    var page = Ext.widget({
        block: 'language',
        xtype: 'uxeditpage',
        gridPage: 'language.html',
        formCfg: {
            model: 'CGP.model.RemoteSurcharge',
            remoteCfg: false,
            items: [{
                useValueField: true,
                xtype: 'gridcombo',
                itemId: 'countryCode',
                fieldLabel: i18n.getKey('countryCode'),
                allowBlank: false,
                name: 'country',
                multiSelect: false,
                displayField: 'name',
                valueField: 'id',
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
            }, {
                name: 'status',
                xtype: 'combobox',
                fieldLabel: i18n.getKey('status'),
                itemId: 'status',
                allowBlank: false,
                store: new Ext.data.Store({
                    fields: ['name', 'id'],
                    data: [{
                        id: 'Y',
                        name: 'YES'
                    }, {
                        id: 'N',
                        name: 'NO'
                    }]
                }),
                displayField: 'name',
                valueField: 'id'
            }, {
                name: 'shippingMode',
                xtype: 'combobox',
                allowBlank: false,
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
            },{
                name: 'startPostcode',
                xtype: 'textfield',
                fieldLabel: i18n.getKey('startPostcode'),
                itemId: 'startPostcode'
            }, {
                name: 'endPostcode',
                xtype: 'textfield',
                fieldLabel: i18n.getKey('endPostcode'),
                itemId: 'endPostcode'
            }, {
                name: 'startOrderAmount',
                xtype: 'numberfield',
                buttonText: 'choice',
                fieldLabel: i18n.getKey('startOrderAmount'),
                itemId: 'startOrderAmount'
            }, {
                name: 'endOrderAmount',
                xtype: 'numberfield',
                fieldLabel: i18n.getKey('endOrderAmount'),
                itemId: 'endOrderAmount'
            }, {
                name: 'firstWeight',
                xtype: 'numberfield',
                fieldLabel: i18n.getKey('firstWeight'),
                itemId: 'firstWeight'
            }, {
                name: 'firstFee',
                xtype: 'numberfield',
                fieldLabel: i18n.getKey('firstFee'),
                itemId: 'firstFee'
            }, {
                name: 'plusWeight',
                xtype: 'numberfield',
                fieldLabel: i18n.getKey('plusWeight'),
                itemId: 'plusWeight'
            }, {
                name: 'plusFee',
                xtype: 'numberfield',
                fieldLabel: i18n.getKey('plusFee'),
                itemId: 'plusFee'
            }, {
                name: 'minCharge',
                xtype: 'numberfield',
                fieldLabel: i18n.getKey('minCharge'),
                itemId: 'minCharge'
            }]
        },
        listeners: {}
    });
});