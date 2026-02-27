/**
 * Created by miao on 2021/8/26.
 */
Ext.define('CGP.resource.view.dynamicSizeImage.Main', {
    extend: 'Ext.ux.ui.GridPage',
    alias: 'widget.imagemain',
    config: {
        i18nblock: i18n.getKey('dynamicSizeImage'),
        block: 'resource/app/view/dynamicSizeImage',
        editPage: 'edit.html',
        //权限控制
        //accessControl: true,
        gridCfg: {
            store: 'DynamicSizeImage',
            columns: [
                {
                    text: i18n.getKey('id'),
                    dataIndex: '_id',
                    xtype: 'gridcolumn',
                    sortable: true,
                    width: 80
                },
                {
                    text: i18n.getKey('fixSizeImageConfig'),
                    dataIndex: '_id',
                    xtype: 'componentcolumn',
                    width: 100,
                    renderer: function (value, metadata, record) {
                        return {
                            xtype: 'toolbar',
                            layout: 'column',
                            style: 'padding:0',
                            default: {
                                width: 100
                            },
                            items: [
                                {
                                    text: i18n.getKey('options'),
                                    width: '100%',
                                    flex: 1,
                                    menu: {
                                        xtype: 'menu',
                                        items: [
                                            {
                                                text: i18n.getKey('fixSizeImageConfig'),
                                                itemId: 'fixSizeImageConfig',
                                                disabledCls: 'menu-item-display-none',
                                                handler: function () {
                                                    var resourcePanel =window.parent.Ext.getCmp('compositeDisplayObjectSRC').ownerCt;
                                                    var fixSizeDCUrl = path + 'partials/resource/app/view/dynamicSizeImage/fixSizeImageConfig/main.html?dsId='+record.get('_id');
                                                    var tabs=resourcePanel.query('#fixSizeImageTab'),tabDC=null;
                                                    if (tabs.length>0) {
                                                        tabDC=tabs[0];
                                                        tabDC.update('<iframe id="tabs_iframe_fixSizeDisplayConfig" src="' + fixSizeDCUrl + '" width="100%" height="100%" frameBorder="0" onload="showOpenNewIframeError()" onactivate="Ext.menu.MenuMgr.hideAll();"></iframe>');
                                                    } else {
                                                        tabDC=resourcePanel.add(
                                                            {
                                                                id: 'fixSizeImageTab',
                                                                title: i18n.getKey('fixSizeDisplayConfig'),
                                                                origin: window.location.href,
                                                                html: '<iframe id="tabs_iframe_fixSizeDisplayConfig" src="' + fixSizeDCUrl + '" width="100%" height="100%" frameBorder="0" onload="showOpenNewIframeError()" onactivate="Ext.menu.MenuMgr.hideAll();"></iframe>',
                                                                closable: true
                                                            }
                                                        );
                                                    }
                                                    resourcePanel.setActiveTab(tabDC);
                                                }
                                            }
                                        ]
                                    }
                                }
                            ]
                        };
                    }
                },
                {
                    text: i18n.getKey('name'),
                    dataIndex: 'name',
                    xtype: 'gridcolumn',
                    width: 160,
                    sortable: true,
                    renderer: function (value, metadata, record) {
                        metadata.tdAttr = 'data-qtip="' + value + '"';
                        return value;
                    }
                },
                {
                    text: i18n.getKey('width') + i18n.getKey('height'),
                    dataIndex: 'generateRule',
                    xtype: 'gridcolumn',
                    flex: 1,
                    // width: 200,
                    renderer: function (value, metadata, record) {
                        var result = '宽:' + (value)?.sourceImage?.width + ' , ';
                        result += '高:' + (value)?.sourceImage?.height;
                        metadata.tdAttr = 'data-qtip="' + result + '"';
                        return result;
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
                    id: 'nameSearch',
                    itemId: 'nameSearch',
                    name: 'name',
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('name'),
                },
            ]
        }
    },
    constructor: function (config) {
        var me = this;
        me.initConfig(config);
        me.callParent([config]);
    },
});