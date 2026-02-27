/**
 * Created by nan on 2018/8/29.
 */
Ext.define("CGP.useableauthoritymanage.view.CheckPermission", {
        extend: 'Ext.window.Window',
        modal: true,
        width: 400,
        height: 400,
        constrain: true,//限制在父容器内
        layout: 'fit',
        title: i18n.getKey('check') + i18n.getKey('permission'),
        initComponent: function () {
            var me = this;
            var data = me.data;
            var grid = Ext.create('Ext.grid.Panel', {
                header: false,
                autoScroll: true,
                store: Ext.create('Ext.data.Store', {
                    fields: ['resource', 'operation', 'id'],
                    data: me.data
                }),
                viewConfig: {
                    stripeRows: true,
                    enableTextSelection: true
                },
                columns: [
                    {
                        dataIndex: 'resource',
                        text: i18n.getKey('resources'),
                        flex: 1,
                        tdCls: 'vertical-middle',
                        xtype: 'componentcolumn',
                        renderer: function (value, metadata, record) {
                            metadata.tdAttr = 'data-qtip=' + value;
                            var id = record.get('id');
                            return {
                                xtype: 'displayfield',
                                value: value + '<a href="#" style="color: green" ) >(' + record.get('id') + ')</a>',
                                listeners: {
                                    render: function (display) {
                                        var a = display.el.dom.getElementsByTagName('a')[0]; //获取到该html元素下的a元素
                                        var ela = Ext.fly(a); //获取到a元素的element封装对象
                                        ela.on("click", function () {
                                            JSOpen({
                                                title: i18n.getKey('resources'),
                                                url: path + 'partials/resourcesmanage/Main.html?_id=' + id,
                                                id: 'resourcesmanagepage',
                                                refresh: true
                                            })

                                        });
                                    }
                                }
                            };
                        }
                    },
                    {
                        dataIndex: 'operation',
                        text: i18n.getKey('operation'),
                        flex: 1,
                        tdCls: 'vertical-middle'
                    }
                ]
            });
            me.items = [grid];
            me.callParent();
        }
    }
)