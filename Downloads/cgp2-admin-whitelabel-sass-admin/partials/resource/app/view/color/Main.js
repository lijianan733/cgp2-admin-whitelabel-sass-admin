/**
 * Created by miao on 2021/8/26.
 */
Ext.Loader.setPath('CGP.resource', '../../../app');
Ext.define('CGP.resource.view.color.Main', {
    extend: 'Ext.ux.ui.GridPage',
    alias: 'widget.imagemain',
    config: {
        i18nblock: i18n.getKey('color'),
        block: 'resource/app/view/color',
        editPage: 'edit.html',
        //权限控制
        //accessControl: true,
        tbarCfg: {
            btnCreate: {
                xtype: 'splitbutton',
                width: 80,
                menu: [
                    {
                        text: i18n.getKey('RGB'),
                        itemId: 'addRGB',
                        handler: function (btn) {
                            var controller = Ext.create('CGP.resource.controller.Color');
                            controller.edit(btn, 'RGBColor');
                        }
                    },
                    {
                        text: i18n.getKey('CMYK'),
                        itemId: 'addCMYK',
                        handler: function (btn) {
                            var controller = Ext.create('CGP.resource.controller.Color');
                            controller.edit(btn, 'CMYKColor');
                        }
                    },
                    {
                        text: i18n.getKey('Spot'),
                        itemId: 'addSpot',
                        handler: function (btn) {
                            var controller = Ext.create('CGP.resource.controller.Color');
                            controller.edit(btn, 'SpotColor');
                        }
                    }
                ],
                handler: function (btn) {
                }
            }
        },
        gridCfg: {
            store: 'Color',
            editActionHandler: function (grid, rowIndex, colIndex) {
                var rec = grid.getStore().getAt(rowIndex);
                var controller = Ext.create('CGP.resource.controller.Color'),
                    clazz = rec.get('clazz');
                controller.edit(this, clazz.substr(clazz.lastIndexOf('.') + 1), rec.get('_id'));
            },
            columns: [
                {
                    text: i18n.getKey('id'),
                    dataIndex: '_id',
                    xtype: 'gridcolumn',
                    sortable: true,
                    width: 100
                },
                {
                    text: i18n.getKey('show') + i18n.getKey('color'),
                    itemId: 'color',
                    dataIndex: 'color',
                    width: 200,
                    renderer: function (value, metadata, record) {
                        var color = value.toLocaleUpperCase();
                        if (color.startsWith('#') > 0) {
                            return ('<a class=colorpick style="background-color:' + color + '"></a>' + color);
                        } else {
                            return value;
                        }
                    }
                },
                {
                    text: i18n.getKey('name'),
                    dataIndex: 'name',
                    xtype: 'gridcolumn',
                    width: 200,
                    renderer: function (value, metadata, record) {
                        metadata.tdAttr = 'data-qtip="' + value + '"';
                        return value;
                    }
                },
                {
                    text: i18n.getKey('type'),
                    dataIndex: 'clazz',
                    xtype: 'gridcolumn',
                    width: 120,
                    renderer: function (value, metadata, record) {
                        var result = value.substr(value.lastIndexOf('.') + 1).replace('Color', '');
                        if (result == 'Spot') {
                            result = '专色';
                        }
                        metadata.tdAttr = 'data-qtip="' + result + '"';
                        return result;
                    }
                },
                {
                    text: i18n.getKey('value'),
                    dataIndex: '_id',
                    xtype: 'gridcolumn',
                    flex: 1,
                    minWidth: 120,
                    renderer: function (value, metadata, record) {
                        var result = record.get('gray');
                        if (record.get('clazz').indexOf('RGBColor') > 0) {
                            result = Ext.String.format('{0},{1},{2}', record.get('r'), record.get('g'), record.get('b'));
                        } else if (record.get('clazz').indexOf('CMYKColor') > 0) {
                            result = Ext.String.format('{0},{1},{2},{3}', record.get('c'), record.get('m'), record.get('y'), record.get('k'));
                        }
                        metadata.tdAttr = 'data-qtip="' + result + '"';
                        return result;
                    }
                }
            ]
        },
        // 搜索框
        filterCfg: {
            defaults: {
                isLike: false
            },
            items: [
                {
                    id: 'idSearchField',
                    name: '_id',
                    xtype: 'numberfield',
                    fieldLabel: i18n.getKey('id'),
                    hideTrigger: true,
                    listeners: {
                        render: function (comp) {
                            var searchId = JSGetQueryString('dataSourceId');
                            if (searchId) {
                                comp.setValue(searchId);
                            }
                        }
                    }
                },
                {
                    id: 'nameSearch',
                    name: 'name',
                    xtype: 'textfield',
                    itemId: 'nameSearch',
                    fieldLabel: i18n.getKey('name'),
                },
                {
                    id: 'formatSearch',
                    name: 'clazz',
                    xtype: 'combobox',
                    itemId: 'formatSearch',
                    fieldLabel: i18n.getKey('color') + i18n.getKey('type'),
                    displayField: 'typeName',
                    valueField: 'value',
                    value: '',
                    editable: false,
                    store: new Ext.data.Store({
                        fields: ['value', 'typeName'],
                        data: [
                            {
                                typeName: 'RGB',
                                value: 'com.qpp.cgp.domain.pcresource.color.RGBColor'
                            },
                            {
                                typeName: 'CMYK',
                                value: 'com.qpp.cgp.domain.pcresource.color.CMYKColor'
                            },
                            {
                                typeName: i18n.getKey('Spot'),
                                value: 'com.qpp.cgp.domain.pcresource.color.SpotColor'
                            },
                            {
                                value: '',
                                typeName: i18n.getKey('allType')
                            }
                        ]
                    })
                }
            ]
        }
    },
    constructor: function (config) {
        var me = this;
        me.initConfig(config);
        me.callParent([config]);
    },
});