/**
 * Created by nan on 2021/12/14
 */
Ext.Loader.syncRequire([
    'CGP.country.model.CountryModel'
])
Ext.define('CGP.common.commoncomp.AddressBookForm', {
    extend: 'Ext.ux.form.ErrorStrickForm',
    alias: 'widget.address_book_form',
    bodyStyle: {
        padding: '10px'
    },
    defaults: {
        labelWidth: 80,
        width: 290,
        margin: '5 25',
        labelAlign: 'right',
        msgTarget: 'side',
    },
    initComponent: function () {
        var me = this;
        var countryData = [];
        var url1 = adminPath + 'api/countries?page=1&start=0&limit=1000';
        JSAjaxRequest(url1, 'GET', false, null, false, function (require, success, response) {
            if (success) {
                var responseText = Ext.JSON.decode(response.responseText);
                if (responseText.success) {
                    countryData = responseText.data.content;
                }
            }
        }, false);

        var countryStore = Ext.create('CGP.country.store.CountryStore', {
            pageSize: 1000,
            proxy: {
                type: 'pagingmemory',
            },
            data: countryData
        });
        countryStore.load();
        var zoneData = [];
        var url2 = adminPath + 'api/zones?page=1&start=0&limit=1000';
        JSAjaxRequest(url2, 'GET', false, null, false, function (require, success, response) {
            if (success) {
                var responseText = Ext.JSON.decode(response.responseText);
                if (responseText.success) {
                    zoneData = responseText.data.content;
                }
            }
        }, false);
        var zoneStore = Ext.create('CGP.zone.store.Zone', {
            pageSize: 1000,
            proxy: {
                type: 'pagingmemory',
            },
            data: zoneData
        });
        zoneStore.load();
        me.items = [
            {
                xtype: 'hiddenfield',
                name: 'id',
                itemId: 'id'
            },
            {
                xtype: 'textfield',
                name: "firstName",
                itemId: 'firstName',
                allowBlank: false,
                fieldLabel: i18n.getKey('firstName')
            },
            {
                xtype: 'textfield',
                name: "lastName",
                itemId: 'laseName',
                fieldLabel: i18n.getKey('lastName')
            },
            {
                xtype: 'combo',
                name: "gender",
                editable: false,
                fieldLabel: i18n.getKey('gender'),
                store: Ext.create('Ext.data.Store', {
                    fields: ['gender', 'desc'],
                    data: [
                        {
                            gender: 'M',
                            desc: i18n.getKey('male')
                        },
                        {
                            gender: 'F',
                            desc: i18n.getKey('female')
                        },
                        {
                            gender: 'U',
                            desc: ""
                        }
                    ]
                }),
                itemId: 'gender',
                displayField: 'desc',
                valueField: 'gender',
                queryMode: 'local'
            },
            {
                xtype: 'textfield',
                hidden: true,
                editable: true,
                itemId: 'countryName',
                name: 'countryName',

            },
            {
                xtype: 'combo',
                displayField: 'name',
                valueField: 'isoCode2',
                editable: true,
                allowBlank: false,
                store: countryStore,
                haveReset: true,
                forceSelection: true,
                autoSelect: false,
                queryMode: 'local',
                triggerAction: 'all',
                name: 'countryCode2',
                itemId: 'countryCode2',
                fieldLabel: i18n.getKey('countryName'),
                listeners: {
                    change: function (comp, value) {
                        var form = comp.ownerCt,
                            countryName = form.getComponent('countryName');
                        var record = countryStore.findRecord('isoCode2', value);
                        if (record) {
                            var data = record.getData();
                            countryName.setValue(data['name']);
                            var state = form.getComponent('state');
                            var stateTextField = form.getComponent('stateTextField');
                            var stateCode = form.getComponent('stateCode');
                            if (data['needState'] == true && data['isoCode2'] == 'US') {
                                //如果是美国，就为必填
                                state.setVisible(true);
                                state.setDisabled(false);
                                state.setAllowBlank(false);
                                stateTextField.setVisible(false);
                                stateTextField.setDisabled(true);
                                stateCode.setDisabled(false);
                            } else if (data['needState'] == true && data['isoCode2'] != 'US') {
                                //如果是不是美国，就为文本框，随便填
                                state.setVisible(false);
                                state.setDisabled(true);
                                state.setValue(null);
                                stateTextField.setVisible(true);
                                stateTextField.setDisabled(false);
                                stateCode.setDisabled(true);
                            } else if (data['needState'] == false) {
                                //隐藏
                                state.setVisible(false);
                                state.setDisabled(true);
                                state.setValue(null);
                                stateCode.setDisabled(true);
                                stateTextField.setVisible(false);
                                stateTextField.setDisabled(true);
                            }
                        }
                    }
                }
            },
            {
                xtype: 'textfield',
                itemId: 'stateCode',
                name: 'stateCode',
                hidden: true,
                fieldLabel: i18n.getKey('stateCode')
            },
            {
                xtype: 'combo',
                displayField: 'name',
                valueField: 'name',
                editable: true,
                store: zoneStore,
                itemId: 'state',
                name: 'state',
                forceSelection: true,
                allowBlank: false,
                haveReset: true,
                autoSelect: false,
                queryMode: 'local',
                triggerAction: 'all',
                fieldLabel: i18n.getKey('state'),
                listeners: {
                    change: function (comp, value) {
                        var form = comp.ownerCt,
                            stateCode = form.getComponent('stateCode');
                        var record = zoneStore.findRecord('name', value);
                        if (record) {
                            stateCode.setValue(record.get('code'));
                        } else {
                            stateCode.setValue(null);
                        }
                    }
                }
            },
            {
                xtype: 'textfield',
                fieldLabel: i18n.getKey('state'),
                allowBlank: false,
                hidden: true,
                itemId: 'stateTextField',
                name: 'state',
            },

            {
                xtype: 'textfield',
                name: "postcode",
                itemId: 'postcode',
                fieldLabel: i18n.getKey('postCode')
            },
            {
                xtype: 'textfield',
                allowBlank: false,
                name: "city",
                itemId: 'city',
                fieldLabel: i18n.getKey('city')
            },
            {
                xtype: 'textfield',
                allowBlank: true,
                name: "suburb",
                itemId: 'suburb',
                fieldLabel: i18n.getKey('suburb')
            },
            {
                xtype: 'textfield',
                allowBlank: false,
                itemId: 'streetAddress1',
                name: "streetAddress1",
                fieldLabel: i18n.getKey('streetAddress') + '1'
            },
            {
                xtype: 'textfield',
                name: "streetAddress2",
                itemId: 'streetAddress2',
                fieldLabel: i18n.getKey('streetAddress') + '2'
            },
            {
                xtype: 'textfield',
                name: "mobile",
                itemId: 'mobile',
                fieldLabel: i18n.getKey('mobile')
            },
            {
                xtype: 'textfield',
                name: "telephone",
                itemId: 'telephone',
                fieldLabel: i18n.getKey('telephone')
            },
            {
                xtype: 'textfield',
                name: "emailAddress",
                itemId: 'emailAddress',
                regex: /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/,
                regexText: i18n.getKey('Please enter the correct email!'),
                fieldLabel: i18n.getKey('emailAddress')
            },
            {
                xtype: 'textfield',
                name: "company",
                itemId: 'company',
                fieldLabel: i18n.getKey('company')
            },
            {
                xtype: 'numberfield',
                name: "sortOrder",
                itemId: 'sortOrder',
                allowDecimals: false,
                allowBlank: false,
                fieldLabel: i18n.getKey('sortOrder'),
                minValue: 0,
                value: 0
            },
            {
                xtype: 'combo',
                name: "locationType",
                itemId: 'locationType',
                editable: false,
                fieldLabel: i18n.getKey('addressType'),
                store: new Ext.data.Store({
                    fields: ['value'],
                    data: [
                        {value: 'HOUSE'},
                        {value: 'POBOX'},
                        {value: 'BUSINESS'},
                        {value: 'OTHER'}
                    ]
                }),
                displayField: 'value',
                valueField: 'value',
                queryMode: 'local'
            },
        ];
        me.callParent();

    }
})
