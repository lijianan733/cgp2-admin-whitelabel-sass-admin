/**
 * Created by miao on 2021/8/26.
 */
Ext.define('CGP.resource.view.compositeDisplayObject.Main', {
    extend: 'Ext.ux.ui.GridPage',
    alias: 'widget.imagemain',
    config: {
        i18nblock: i18n.getKey('compositeDisplayObject'),
        block: 'resource/app/view/compositeDisplayObject',
        editPage: 'edit.html',
        //权限控制
        //accessControl: true,
        gridCfg: {
            store: 'CompositeDisplayObject',
            columns: [
                {
                    text: i18n.getKey('id'),
                    dataIndex: '_id',
                    xtype: 'gridcolumn',
                    sortable: true,
                    width: 80
                },
                {
                    text: i18n.getKey('fixSizeDisplayConfig'),
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
                                                text: i18n.getKey('fixSizeDisplayConfig'),
                                                itemId: 'fixSizeDisplayConfig',
                                                disabledCls: 'menu-item-display-none',
                                                handler: function () {
                                                    var resourcePanel =window.parent.Ext.getCmp('compositeDisplayObjectSRC').ownerCt;
                                                    var fixSizeDCUrl = path + 'partials/resource/app/view/compositeDisplayObject/fixSizeDisplayObject/main.html?dcId='+record.get('_id');
                                                    var tabs=resourcePanel.query('#fixSizeDCTab'),tabDC=null;
                                                    if (tabs.length>0) {
                                                        tabDC=tabs[0];
                                                        tabDC.update('<iframe id="tabs_iframe_textParamete" src="' + fixSizeDCUrl + '" width="100%" height="100%" frameBorder="0" onload="showOpenNewIframeError()" onactivate="Ext.menu.MenuMgr.hideAll();"></iframe>');
                                                    } else {
                                                        tabDC=resourcePanel.add(
                                                            {
                                                                id: 'fixSizeDCTab',
                                                                title: i18n.getKey('fixSizeDisplayConfig'),
                                                                origin: window.location.href,
                                                                html: '<iframe id="tabs_iframe_textParamete" src="' + fixSizeDCUrl + '" width="100%" height="100%" frameBorder="0" onload="showOpenNewIframeError()" onactivate="Ext.menu.MenuMgr.hideAll();"></iframe>',
                                                                closable: true
                                                            }
                                                        );
                                                    }
                                                    resourcePanel.setActiveTab(tabDC);
                                                }
                                            },
                                            // {
                                            //     text: i18n.getKey('dynamicSizeFillRule'),
                                            //     itemId:'dynamicSizeFillRule',
                                            //     disabledCls: 'menu-item-display-none',
                                            //     handler: function () {
                                            //
                                            //     }
                                            // },
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
                    dataIndex: 'sourceContainerWidth',
                    xtype: 'gridcolumn',
                    flex: 1,
                    renderer: function (value, metadata, record) {
                        var result = '宽:' + value + ' , ';
                        result += '高:' + record.get('sourceContainerHeight')
                        metadata.tdAttr = 'data-qtip="' + result + '"';
                        return result;
                    }
                },
                {
                    text: i18n.getKey('thumbnail'),
                    dataIndex: 'thumbnail',
                    xtype: 'componentcolumn',
                    flex: 1,
                    minWidth: 120,
                    renderer: function (value, metadata, record) {
                        if (value) {
                            var imageUrl = imageServer + value;
                            var imageName = record.get('sourceFileName');
                            var preViewUrl = null;
                            if (imageUrl.indexOf('.pdf') != -1) {
                                imageUrl += '?format=jpg';
                                preViewUrl = imageUrl + '&width=100&height=100';
                            } else {
                                preViewUrl = imageUrl + '?width=100&height=100';
                            }
                            return {
                                xtype: 'container',
                                width: 100,
                                height: 100,
                                layout: 'fit',
                                items: [{
                                    xtype: 'imagecomponent',
                                    src: preViewUrl,
                                    autoEl: 'div',
                                    style: 'cursor: pointer',
                                    listeners: {
                                        el: {
                                            click: function () {
                                                var win = Ext.create('Ext.ux.window.CheckImageWindow', {
                                                    src: imageUrl,
                                                    title: i18n.getKey('图片_') + imageName
                                                });
                                                win.show();
                                            }
                                        }
                                    }

                                }]
                            }
                        }
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