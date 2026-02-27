/**
 * Created by nan on 2018/4/18.
 */
Ext.syncRequire(['CGP.configuration.managedeliveryaddress.controller.Controller', 'CGP.configuration.managedeliveryaddress.model.DeliveryAddressModel']);
Ext.onReady(function () {
    var page = Ext.create('Ext.container.Viewport', {
        layout: 'fit'
    });
    var createOrEdit = JSGetQueryString('createOrEdit');
    var recordId = JSGetQueryString('recordId');
    var controller = Ext.create('CGP.configuration.managedeliveryaddress.controller.Controller');
    var websiteId = JSGetQueryString('websiteId');
    var tbar = Ext.create('Ext.toolbar.Toolbar', {
        items: [
            {
                itemId: 'btnSave',
                text: i18n.getKey('Save'),
                iconCls: 'icon_save',
                handler: function (view) {
                    if (form.isValid()) {
                        myMask.show();
                        var data = controller.dealFormValue(form);
                        controller.editOrCreateAddress(data, myMask, createOrEdit);

                    }
                }
            }
        ]
    });

    var myMask = new Ext.LoadMask(page, {msg: "Please wait..."});
    var form = Ext.create('Ext.form.Panel', {
        tbar: tbar,
        layout: {
            type: 'table',
            columns: 2
        },
        defaults: {
            margin: '10 50 0 50',
            width: 300

        },
        items: [
            {
                xtype: 'textfield',
                name: "_id",
                itemId: '_id',
                hidden:true,
                fieldLabel: i18n.getKey('_id')
            },
            {
                xtype: 'textfield',
                name: "name",
                itemId: 'name',
                allowBlank: false,
                fieldLabel: i18n.getKey('name')
            },
            {
                xtype: 'numberfield',
                name: "websiteId",
                hidden: true,
                itemId: 'websiteId',
                allowBlank: false,
                value: parseInt(websiteId),
                fieldLabel: i18n.getKey('websiteId')
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
                allowBlank: false,
                fieldLabel: i18n.getKey('lastName')
            },
            {
                xtype: 'combo',
                name: "countryCode2",
                itemId: 'countryCode2',
                allowBlank: false,
                editable: false,
                autoSelect: false,
                triggerAction: 'all',
                fieldLabel: i18n.getKey('country'),
                store: new Ext.data.Store({
                    fields: [
                        {
                            name: 'id',
                            type: 'int'
                        },
                        'isoCode2',
                        'name'
                    ],
                    storeId: 'countryStore',
                    remoteSort: true,
                    pageSize: 200,
                    proxy: {
                        type: 'uxrest',
                        url: adminPath + 'api/countries',
                        reader: {
                            type: 'json',
                            root: 'data.content'
                        }
                    },
                    autoLoad: true
                }),
                listeners: {
                    change: function (view, newValue, oldValue) {
                        var countryNameField = view.ownerCt.getComponent('countryName');
                        countryNameField.setValue(view.getDisplayValue())
                    }
                },
                queryMode: 'remote',
                displayField: 'name',
                valueField: 'isoCode2'
            },
            {
                xtype: 'textfield',
                name: "countryName",
                itemId: 'countryName',
                readOnly: true,
                hidden: true,
                fieldLabel: i18n.getKey('countryName')
            },
            {
                xtype: 'textfield',
                name: "clazz",
                itemId: 'clazz',
                readOnly: true,
                hidden: true,
                value: 'com.qpp.cgp.domain.product.config.delivery.Address',
                fieldLabel: i18n.getKey('clazz')
            },
            {
                xtype: 'textfield',
                allowBlank: false,
                name: "state",
                itemId: 'state',
                fieldLabel: i18n.getKey('state')
            },
            {
                xtype: 'textfield',
                name: "postcode",
                itemId: 'postcode',
                fieldLabel: i18n.getKey('postCode')
            },

            {
                xtype: 'numberfield',
                name: "mobile",
                itemId: 'mobile',
                allowBlank: false,
                hideTrigger: true,
                fieldLabel: i18n.getKey('mobile')
            },
            {
                xtype: 'numberfield',
                name: "telephone",
                hideTrigger: true,
                itemId: 'telephone',
                fieldLabel: i18n.getKey('telephone')
            },
            {
                xtype: 'textfield',
                name: "emailAddress",
                colspan: 2,
                allowBlank: false,
                itemId: 'emailAddress',
                fieldLabel: i18n.getKey('emailAddress'),
                regex: /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/,
                regexText: i18n.getKey('Please enter the correct email!')
            },
            {
                xtype: 'textarea',
                allowBlank: false,
                itemId: 'streetAddress1',
                colspan: 2,
                height: 100,
                width: 710,
                name: "streetAddress1",
                fieldLabel: i18n.getKey('streetAddress') + '1'
            },
            {
                xtype: 'textarea',
                name: "streetAddress2",
                colspan: 2,
                height: 100,
                width: 710,
                itemId: 'streetAddress2',
                fieldLabel: i18n.getKey('streetAddress') + '2'
            }
        ],
        listeners: {
            'afterrender': function (view) {
                if (createOrEdit == 'edit') {
                    var record = CGP.configuration.managedeliveryaddress.model.DeliveryAddressModel.load(recordId, {
                        success: function (record, operation) {
                            var data = record.getData();
                            for (var i = 0; i < view.items.items.length; i++) {
                                var item = view.items.items[i]
                                var itemValue = data.address[item.getName()] ? data.address[item.getName()] : null;
                                if (!itemValue) {
                                    itemValue = data[item.getName()] ? data[item.getName()] : null;
                                }
                                item.setValue(itemValue)
                            }
                        }
                    })
                }
            }
        }
    });
    page.add(form)

});