Ext.Loader.syncRequire('CGP.zone.model.Zone');
Ext.onReady(function () {
    var countryStore = Ext.create('CGP.zone.store.countrystore');

    var page = Ext.widget({
        block: 'zone',
        xtype: 'uxeditpage',
        gridPage: 'zone.html',
        formCfg: {
            model: 'CGP.zone.model.Zone',
            remoteCfg: false,
            items: [{
                name: 'code',
                xtype: 'textfield',
                fieldLabel: i18n.getKey('code'),
                allowBlank: false,
                itemId: 'code'
            }, {
                name: 'name',
                xtype: 'textfield',
                fieldLabel: i18n.getKey('name'),
                allowBlank: false,
                itemId: 'name'
            }, {
                xtype: 'gridcombo',
                itemId: 'country',
                editable: false,
                fieldLabel: i18n.getKey('country'),
                allowBlank: false,
                name: 'country',
                autoScroll: true,
                multiSelect: false,
                displayField: 'name',
                valueField: 'id',
                width: 380,
                labelWidth: 100,
                labelAlign: 'right',
                store: countryStore,
                queryMode: 'remote',
                pickerAlign: 'bl',
                matchFieldWidth: false,
                gridCfg: {
                    store: countryStore,
                    //					selModel : new Ext.selection.CheckboxModel({
                    //						checkOnly: true
                    //					}),
                    height: 300,
                    width: 400,
                    columns: [{
                        text: 'id',
                        width: 40,
                        dataIndex: 'id'
                    }, {
                        text: 'name',
                        width: 120,
                        dataIndex: 'name'
                    }, {
                        text: 'code',
                        flex: 1,
                        dataIndex: 'isoCode3'
                    }],
                    bbar: Ext.create('Ext.PagingToolbar', {
                        store: countryStore,
                        pageSize: 10,
                        //displayInfo : true,  是否显示，分页信息
                        //displayMsg : 'Displaying {0} - {1} of {2}', //显示的分页信息
                        emptyMsg: i18n.getKey('noData')
                    })
                }
            }]
        }
    });


});