/**
 * Created by miao on 2021/8/26.
 */
Ext.define('CGP.resource.view.image.Main', {
    extend: 'Ext.ux.ui.GridPage',
    alias: 'widget.imagemain',
    config: {
        i18nblock: i18n.getKey('image'),
        block: 'resource/app/view/image',
        editPage: 'edit.html',
        //权限控制
        //accessControl: true,
        gridCfg: {
            store: 'Image',
            columns: [
                {
                    text: i18n.getKey('id'),
                    dataIndex: '_id',
                    xtype: 'gridcolumn',
                    sortable: true,
                    width: 80
                },
                {
                    text: i18n.getKey('name'),
                    dataIndex: 'name',
                    xtype: 'gridcolumn',
                    width: 300,
                    sortable: true,
                    renderer: function (value, metadata, record) {
                        metadata.tdAttr = 'data-qtip="' + value + '"';
                        return value;
                    }
                },

                {
                    text: i18n.getKey('width') + i18n.getKey('height'),
                    dataIndex: 'width',
                    xtype: 'gridcolumn',
                    width: 200,
                    flex: 1,
                    renderer: function (value, metadata, record) {
                        var result = '宽:' + value + ' , ';
                        result += '高:' + record.get('height')
                        metadata.tdAttr = 'data-qtip="' + result + '"';
                        return result;
                    }
                },
                {
                    text: i18n.getKey('format'),
                    dataIndex: 'format',
                    xtype: 'gridcolumn',
                    width: 100
                },
                {
                    text: i18n.getKey('unit'),
                    dataIndex: 'unit',
                    xtype: 'gridcolumn',
                    sortable: true,
                    width: 100
                },
                {
                    text: i18n.getKey('image'),
                    dataIndex: 'imageName',
                    xtype: 'imagecolumn',
                    width: 120,
                    buildUrl: function (value) {
                        var image = value;
                        var imgSize = '/100/100/png?' + Math.random();
                        return (imageServer + image + imgSize);
                    },
                    buildPreUrl: function (value) {
                        var image = value;
                        return (imageServer + image);
                    },
                    buildTitle: function (value, metadata, record) {
                        return `${i18n.getKey('check')} < ${record.get('name')} >预览图`;
                    },
                },
                {
                    text: i18n.getKey('thumbnail'),
                    dataIndex: 'thumbnail',
                    xtype: 'imagecolumn',
                    width: 120,
                    buildUrl: function (value) {
                        var imageUrl = imageServer + value;
                        if (imageUrl.indexOf('.pdf') != -1) {
                            imageUrl += '?format=jpg';
                        }
                        return imageUrl;
                    },
                    buildPreUrl: function (value) {
                        var imageUrl = imageServer + value;
                        if (imageUrl.indexOf('.pdf') != -1) {
                            imageUrl += '?format=jpg';
                        }
                        return imageUrl;
                    }
                },
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
                    itemId: 'id',
                    xtype: 'textfield',
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
                    itemId: 'name',
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('name'),
                },
                {
                    id: 'formatSearch',
                    name: 'format',
                    itemId: 'format',
                    xtype: 'combobox',
                    fieldLabel: i18n.getKey('format'),
                    displayField: 'typeName',
                    valueField: 'value',
                    value: '',
                    editable: false,
                    store: new Ext.data.Store({
                        fields: ['value', 'typeName'],
                        data: [
                            {
                                value: 'SVG',
                                typeName: 'SVG'
                            },
                            {
                                value: 'JPG',
                                typeName: 'JPG'
                            },
                            {
                                value: 'PNG',
                                typeName: 'PNG'
                            },
                            {
                                value: '',
                                typeName: i18n.getKey('allType')
                            }
                        ]
                    })
                },
                {
                    name: 'unit',
                    xtype: 'combo',
                    fieldLabel: i18n.getKey('unit'),
                    itemId: 'unit',
                    displayField: 'displayName',
                    valueField: 'value',
                    value: '',
                    queryMode: 'local',
                    editable: false,
                    store: Ext.create('Ext.data.Store', {
                        fields: ['value', 'displayName'],
                        data: [
                            {
                                value: 'px',
                                displayName: 'px'
                            },
                            {
                                value: 'in',
                                displayName: 'in'
                            },
                            {
                                value: 'mm',
                                displayName: 'mm'
                            },
                            {
                                value: 'cm',
                                displayName: 'cm'
                            },
                            {
                                value: '',
                                displayName: i18n.getKey('allType')
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