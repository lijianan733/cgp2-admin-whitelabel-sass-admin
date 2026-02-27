/***
 *
 *
 */

Ext.onReady(function () {

    var countryStore = Ext.create('CGP.country.store.CountryStore');
    var page = Ext.create('Ext.ux.ui.GridPage', {
        i18nblock: i18n.getKey('zone'),
        block: 'zone',

        editPage: 'edit.html',
        accessControl: true,
        gridCfg: {
            //store.js
            store: Ext.create('CGP.zone.store.Zone'),
            frame: false,
            columnDefaults: {
                autoSizeColumn: true
            },
            columns: [{
                text: i18n.getKey('id'),
                dataIndex: 'id',
                itemId: 'id',
                sortable: true
            }, {
                text: i18n.getKey('code'),
                dataIndex: 'code',
                itemId: 'code',
                sortable: true
            }, {
                text: i18n.getKey('name'),
                dataIndex: 'name',
                itemId: 'name',
                sortable: true
            }, {
                text: i18n.getKey('country'),
                dataIndex: 'country',
                itemId: 'country',
                sortable: true,
                flex: 1,
                renderer: function (value) {
                    return value.name
                }
            }]
        },
        filterCfg: {
            items: [{
                name: 'id',
                xtype: 'numberfield',
                hideTrigger: true,
                allowDecimals: false,
                fieldLabel: i18n.getKey('id'),
                itemId: 'id'
            }, {
                name: 'name',
                xtype: 'textfield',
                fieldLabel: i18n.getKey('name'),
                itemId: 'name'
            }, {
                xtype: 'gridcombo',
                name: "country.name",
                itemId: 'country',
                fieldLabel: i18n.getKey('country'),
                displayField: 'name',
                valueField: 'name',
                editable: false,
                store: countryStore,
                matchFieldWidth: false,
                multiSelect: false,
                haveReset: true,
                filterCfg: {
                    layout: {
                        type: 'column',
                        columns: 2
                    },
                    items: [{
                        name: 'id',
                        xtype: 'numberfield',
                        allowDecimals: false,
                        hideTrigger: true,
                        fieldLabel: i18n.getKey('id'),
                        itemId: 'id'
                    }, {
                        name: 'name',
                        xtype: 'textfield',
                        fieldLabel: i18n.getKey('name'),
                        itemId: 'name'
                    }, {
                        name: 'isoCode2',
                        xtype: 'textfield',
                        isLike: false,
                        fieldLabel: i18n.getKey('isoCode') + "(2)",
                        itemId: 'isoCode2'
                    }, {
                        name: 'isoCode3',
                        xtype: 'textfield',
                        isLike: false,
                        fieldLabel: i18n.getKey('isoCode') + "(3)",
                        itemId: 'isoCode3'
                    }]
                },
                gridCfg: {
                    store: countryStore,
                    height: 450,
                    width: 600,
                    columns: [
                        {
                            xtype: 'rownumberer'
                        },
                        {
                            text: i18n.getKey('id'),
                            width: 70,
                            dataIndex: 'id'
                        },
                        {
                            text: i18n.getKey('name'),
                            width: 200,
                            dataIndex: 'name',
                            renderer: function (value, metadata) {
                                metadata.tdAttr = 'data-qtip="' + value + '"';
                                metadata.style = "font-weight:bold";
                                return value;
                            }
                        },
                        {
                            text: i18n.getKey('isoCode') + "(2)",
                            width: 100,
                            dataIndex: 'isoCode2',
                            renderer: function (value, metadata) {
                                metadata.tdAttr = 'data-qtip="' + value + '"';
                                metadata.style = "font-weight:bold";
                                return value;
                            }
                        },
                        {
                            text: i18n.getKey('isoCode') + "(3)",
                            flex: 1,
                            dataIndex: 'isoCode3',
                            renderer: function (value, metadata) {
                                metadata.tdAttr = 'data-qtip="' + value + '"';
                                metadata.style = "font-weight:bold";
                                return value;
                            }
                        }
                    ],
                    bbar: {
                        xtype: 'pagingtoolbar',
                        store: countryStore
                    }
                }
            }]
        }
    });
});


