/**
 * Created by miao on 2021/8/26.
 */
Ext.define('CGP.resource.view.font.Main', {
    extend: 'Ext.ux.ui.GridPage',
    alias: 'widget.fontmain',
    config: {
        i18nblock: i18n.getKey('font'),
        block: 'resource/app/view/font',
        editPage: 'edit.html',
        //权限控制
        //accessControl: true,
        gridCfg: {
            store: 'Font',
            columns: [
                {
                    text: i18n.getKey('id'),
                    dataIndex: '_id',
                    xtype: 'gridcolumn',
                    sortable: true,
                    width: 80
                },
                {
                    text: i18n.getKey('fontFamily'),
                    dataIndex: 'fontFamily',
                    xtype: 'gridcolumn',
                    width: 120,
                    renderer: function (value, metadata, record) {
                        metadata.tdAttr = 'data-qtip="' + value + '"';
                        return value;
                    }
                },
                {
                    text: i18n.getKey('displayName'),
                    dataIndex: 'displayName',
                    xtype: 'gridcolumn',
                    width: 120,
                    renderer: function (value, metadata, record) {
                        metadata.tdAttr = 'data-qtip="' + value + '"';
                        return value;
                    }
                },
                {
                    text: i18n.getKey('wordRegExp'),
                    dataIndex: 'wordRegExp',
                    xtype: 'gridcolumn',
                    width: 160,
                    renderer: function (value, metadata, record) {
                        metadata.tdAttr = 'data-qtip="' + value + '"';
                        return value;
                    }
                },
                {
                    text: i18n.getKey('supportedStyle'),
                    dataIndex: 'supportedStyle',
                    xtype: 'gridcolumn',
                    width: 160,
                    renderer: function (value, metadata, record) {
                        var valueStr = Ext.isArray(value) ? value.join(',') : value;
                        metadata.tdAttr = 'data-qtip="' + valueStr + '"';
                        return valueStr;
                    }
                },
                {
                    text: i18n.getKey('language'),
                    dataIndex: 'languages',
                    xtype: 'gridcolumn',
                    width: 350,
                    renderer: function (value, metadata, record) {
                        var valueStr = value;
                        if (Ext.isArray(value)) {
                            valueStr = "";
                            value.forEach(function (el) {
                                valueStr += el.code.name + ' ,';
                            })
                        }
                        metadata.tdAttr = 'data-qtip="' + valueStr + '"';
                        return valueStr;
                    }
                },
                {
                    xtype: 'imagecolumn',
                    flex: 1,
                    minWidth: 120,
                    dataIndex: 'thumbnail',
                    text: i18n.getKey('thumbnail'),
                    buildUrl: function (value, metadata, record) {
                        var imageUrl = imageServer + value;
                        if (imageUrl.indexOf('.pdf') != -1) {
                            imageUrl += '?format=jpg';
                        } else {
                        }
                        return imageUrl;
                    },
                    buildPreUrl: function (value, metadata, record) {
                        var imageUrl = imageServer + value;
                        if (imageUrl.indexOf('.pdf') != -1) {
                            imageUrl += '?format=jpg';
                        } else {
                        }
                        return imageUrl;
                    },
                    buildTitle: function (value, metadata, record) {
                        var imageName = record.get('sourceFileName');
                        return `${i18n.getKey('check')} < ${imageName} > 预览图`;
                    },
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
                    id: 'nameSearchField',
                    name: 'fontFamily',
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('fontFamily'),
                    itemId: 'fontFamily'
                },
                {
                    id: 'displaynameSearchField',
                    name: 'displayName',
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('displayName'),
                    itemId: 'displayName'
                },
                // {
                //     name: 'languages.id',
                //     xtype: 'combo',
                //     fieldLabel: i18n.getKey('language'),
                //     itemId: 'language',
                //     editable: false,
                //     isLike: false,
                //     haveReset:true,
                //     valueField: 'id',
                //     displayField: 'name',
                //     store: Ext.create('CGP.common.store.Language')
                // }
            ]
        }
    },
    constructor: function (config) {
        var me = this;
        me.initConfig(config);
        me.callParent([config]);
    },
});