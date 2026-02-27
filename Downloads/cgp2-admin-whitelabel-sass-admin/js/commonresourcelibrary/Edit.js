/**
 * Created by nan on 2021/9/11
 */
Ext.Loader.syncRequire([
    'CGP.commonresourcelibrary.model.CommonResourceLibraryModel',
    'CGP.pcresourcelibrary.store.PCResourceLibraryStore',
    'CGP.businesstype.store.BusinessTypeStore'
])
Ext.onReady(function () {
    var businessTypeStore = Ext.create('CGP.businesstype.store.BusinessTypeStore');
    var PCResourceLibraryStore = Ext.create('CGP.pcresourcelibrary.store.PCResourceLibraryStore');
    var page = Ext.widget({
        i18nblock: i18n.getKey('commonResourceLibrary'),
        block: 'commonResourceLibrary',
        xtype: 'uxeditpage',
        gridPage: 'main.html',
        formCfg: {
            model: 'CGP.commonresourcelibrary.model.CommonResourceLibraryModel',
            remoteCfg: false,
            items: [
                {
                    name: 'description',
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('description'),
                    allowBlank: false,
                },
                {
                    name: 'clazz',
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('clazz'),
                    hidden: true,
                    itemId: 'clazz',
                    value: 'com.qpp.cgp.domain.pcresource.BusinessLibraryOfCommon',
                    allowBlank: false,
                },
                {
                    name: 'businessLib',
                    xtype: 'combo',
                    fieldLabel: i18n.getKey('businessType'),
                    itemId: 'businessLib',
                    editable: false,
                    allowBlank: false,
                    valueField: '_id',
                    displayField: 'name',
                    pageSize: 25,
                    matchFieldWidth: false,
                    store: businessTypeStore,
                    diyGetValue: function () {
                        return {
                            clazz: "com.qpp.cgp.domain.pcresource.BusinessLibrary",
                            _id: this.getValue()
                        }
                    },
                    diySetValue: function (data) {
                        if (data) {
                            this.setValue(data._id);
                        }
                    },
                    listeners: {
                        change: function (combo, newValue, oldValue) {
                            var record = combo.store.getById(newValue);
                            var pcResourceLibrary = combo.ownerCt.getComponent('library');
                            pcResourceLibrary.setDisabled(false);
                            if (record) {
                                var type = record.getData().type;
                                PCResourceLibraryStore.proxy.extraParams = {
                                    filter: Ext.JSON.encode([{
                                        name: 'type',
                                        type: 'string',
                                        value: type
                                    }])
                                };
                                PCResourceLibraryStore.load();
                                if (!Ext.isEmpty(oldValue)) {
                                    pcResourceLibrary.setValue();
                                    pcResourceLibrary.setRawValue();
                                }
                            }
                        }
                    }
                },
                {
                    name: 'library',
                    xtype: 'gridcombo',
                    fieldLabel: i18n.getKey('pcResourceLibrary'),
                    allowBlank: false,
                    itemId: 'library',
                    displayField: 'displayInfo',
                    valueField: '_id',
                    store: PCResourceLibraryStore,
                    matchFieldWidth: false,
                    editable: false,
                    haveReset: true,
                    disabled: true,
                    multiSelect: false,
                    gridCfg: {
                        height: 350,
                        width: 800,
                        columns: [
                            {
                                text: i18n.getKey('id'),
                                dataIndex: '_id'
                            }, {
                                text: i18n.getKey('name'),
                                dataIndex: 'name',
                                width: 200,
                            },
                            {
                                text: i18n.getKey('description'),
                                dataIndex: 'description',
                                width: 350,
                            },
                            {
                                text: i18n.getKey('resources') + i18n.getKey('type'),
                                dataIndex: 'type',
                                width: 150,
                                flex: 1,
                                renderer: function (value) {
                                    var type = value.split('.').pop();
                                    return type;
                                }
                            },
                        ],
                        bbar: {
                            xtype: 'pagingtoolbar',
                            store: PCResourceLibraryStore,
                        }
                    },
                    diySetValue: function (data) {
                        if (data) {
                            this.setInitialValue([data._id]);
                        }
                    }
                }
            ]
        },
    });
});
