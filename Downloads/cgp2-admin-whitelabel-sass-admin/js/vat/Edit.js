Ext.Loader.syncRequire([
    'CGP.vat.model.QPVatModel',
    'CGP.vat.view.CountryGridCombo',
    'CGP.country.store.CountryStore'
])
Ext.onReady(function () {
    var page = Ext.widget({
        block: 'vat',
        i18nblock: i18n.getKey('税资质'),
        xtype: 'uxeditpage',
        enablePermissionChecker: false,
        gridPage: 'main2.html',
        formCfg: {
            model: 'CGP.vat.model.QPVatModel',
            remoteCfg: false,
            columnCount: 1,
            useForEach: true,
            items: [
                {
                    name: '_id',
                    xtype: 'hiddenfield',
                    allowBlank: true,
                    fieldLabel: i18n.getKey('id'),
                    itemId: '_id'
                },
                {
                    name: 'clazz',
                    xtype: 'hiddenfield',
                    allowBlank: true,
                    fieldLabel: i18n.getKey('clazz'),
                    itemId: 'clazz',
                    value: 'com.qpp.cgp.domain.qp.QPVatId'
                },
                {
                    xtype: 'country_gridcombo',
                    name: 'countryCode',
                    itemId: 'countryCode',
                    fieldLabel: i18n.getKey('国家/地区'),
                    valueType: 'id',
                    allowBlank: false,
                    diySetValue: function (object) {
                        var me = this;
                        var form = me.ownerCt;
                        var data = form.getModel()[0].get('countryCode2')
                        me.setValue(data);
                    },
                    diyGetValue: function (object) {
                        var me = this;
                        return me.getSubmitValue()[0];
                    },
                },
                {
                    name: 'status',
                    xtype: 'combo',
                    fieldLabel: i18n.getKey('status'),
                    itemId: 'status2',
                    valueField: 'value',
                    displayField: 'display',
                    editable: false,
                    allowBlank: false,
                    store: {
                        xtype: 'store',
                        fields: [
                            'value', 'display'
                        ],
                        data: [
                            {
                                value: 'Valid',
                                display: '生效'
                            },
                            {
                                value: 'Invalid',
                                display: '无效'
                            }
                        ]
                    }
                },
                {
                    xtype: 'textarea',
                    fieldLabel: i18n.getKey('VAT ID'),
                    itemId: 'vatId',
                    name: 'vatId',
                    allowBlank: false,
                    height: 80
                },
                {
                    xtype: 'textarea',
                    allowBlank: true,
                    fieldLabel: i18n.getKey('remark'),
                    itemId: 'remark',
                    name: 'remark',
                    height: 80
                }
            ],
        }
    });
});