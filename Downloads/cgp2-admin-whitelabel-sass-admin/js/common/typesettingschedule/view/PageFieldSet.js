/**
 * @Description:
 * @author nan
 * @date 2022/11/5
 */
Ext.Loader.syncRequire([
    'CGP.common.typesettingschedule.view.FileColumn',
])
Ext.define('CGP.common.typesettingschedule.view.PageFieldSet', {
    extend: 'Ext.ux.form.field.UxFieldSet',
    alias: 'widget.pagefieldset',
    layout: 'fit',
    data: null,
    collapsible: true,
    border: '1 0 0 0 ',
    padding: '3px 10px 0px 10px',
    extraButtons: {
        edit: {
            xtype: 'button',
            margin: '0 5 0 5',
            iconCls: 'icon_check',
            ui: 'default-toolbar-small',
            text: i18n.getKey('查看源JSON'),
            handler: function (btn) {
                var impressionFieldSet = btn.ownerCt.ownerCt;
                var data = impressionFieldSet.data;
                var title = '源JSON';
                JSShowJsonDataV2(data, title);
            }
        }
    },
    orderItemId: null,
    jobConfigId: null,
    pageConfigId: null,
    initComponent: function () {
        var me = this,
            store = Ext.create('CGP.common.typesettingschedule.store.PageFieldSet', {
                params: {
                    orderItemId: me.orderItemId,
                    jobConfigId: me.jobConfigId,
                    pageConfigId: me.pageConfigId,
                }
            });

        me.items = [
            {
                xtype: 'grid',
                itemId: 'pageData',
                store: store,
                allowScroll: true,
                maxHeight: 600,
                columns: [
                    {
                        xtype: 'rownumberer',
                        tdCls: 'vertical-middle',
                        width: 45
                    },
                    {
                        text: i18n.getKey('id'),
                        dataIndex: '_id',
                        sortable: true
                    },
                    {
                        text: i18n.getKey('width'),
                        dataIndex: 'width',
                        width: 100,
                    },
                    {
                        text: i18n.getKey('height'),
                        dataIndex: 'height',
                        width: 100,
                    },
                    {
                        text: i18n.getKey('status'),
                        dataIndex: 'status',
                        width: 120,
                        renderer: function (value, metadata, record) {
                            var val = value.toString();
                            metadata.tdAttr = 'data-qtip="' + val + '"';
                            return val;
                        }
                    },
                    {
                        text: i18n.getKey('sortOrder'),
                        dataIndex: 'sortOrder',
                        width: 120,
                    },
                    {
                        text: i18n.getKey('params'),
                        dataIndex: 'params',
                        xtype: 'componentcolumn',
                        minWidth: 100,
                        renderer: function (value, metadata, record) {
                            if (value) {
                                var strValue = value.length;
                                metadata.tdAttr = 'data-qtip="查看params"';
                                return {
                                    xtype: 'displayfield',
                                    value: '<a href="#" id="click-params">查看</a>',
                                    listeners: {
                                        render: function (display) {
                                            var clickElement = document.getElementById('click-params');
                                            clickElement.addEventListener('click', function () {
                                                var wind = Ext.create("Ext.window.Window", {
                                                    modal: true,
                                                    constrain: true,
                                                    itemId: "pageParams",
                                                    title: i18n.getKey('pageParams'),
                                                    layout: 'fit',
                                                    items: [
                                                        Ext.create('CGP.common.typesettingschedule.view.Params', {data: value})
                                                    ]
                                                });
                                                wind.show();
                                            }, false);
                                        }
                                    }
                                }
                            } else {
                                return "";
                            }
                        }
                    },
                    {
                        xtype: 'filecolumn',
                        text: i18n.getKey('file'),
                        dataIndex: 'file',
                        width: 500,
                        flex: 1,
                        getDisplayName: function (value) {
                            var url = value.replace('smb:', '');
                            return JSAutoWordWrapStr(url)
                        },
                    },
                ],
                bbar: {
                    xtype: 'pagingtoolbar',
                    store: store
                }
            }
        ];
        me.callParent();
    },
    setValue: function (data) {
        var me = this;
        me.data = data;
        var pageData = me.getComponent('pageData');
        if (data) {
            pageData.store.proxy.data = data;
            pageData.store.load();
        }
    }

})
