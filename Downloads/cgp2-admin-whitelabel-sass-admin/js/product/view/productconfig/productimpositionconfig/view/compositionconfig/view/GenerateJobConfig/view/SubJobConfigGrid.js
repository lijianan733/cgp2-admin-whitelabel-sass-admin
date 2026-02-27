/**
 * Created by nan on 2020/7/7.
 * 展开时显示的小grid
 */
Ext.define('CGP.product.view.productconfig.productimpositionconfig.view.compositionconfig.view.GenerateJobConfig.view.SubJobConfigGrid', {
    extend: 'Ext.grid.Panel',
    margin: '0 0 0 45',
    width: 1200,
    store: null,
    alias: 'widget.subjobconfiggrid',
    initComponent: function () {
        var me = this;
        var controller = Ext.create('CGP.product.view.productconfig.productimpositionconfig.view.compositionconfig.view.GenerateJobConfig.controller.Controller');
        me.columns = [
            {
                text: i18n.getKey('id'),
                dataIndex: '_id',
                width: 100
            },
            {
                text: i18n.getKey('name'),
                dataIndex: 'name',
                width: 150,
            },
            {
                text: i18n.getKey('单个Job配置编号'),
                dataIndex: 'singleJobConfig',
                width: 200,
                xtype: 'componentcolumn',
                renderer: function (value, metadata, record) {
                    if (value) {
                        return value._id;
                    }
                }
            },

            {
                text: i18n.getKey('job配置名称'),
                dataIndex: 'singleJobConfig',
                width: 250,
                renderer: function (value, medate, record) {
                    return value.name;
                }
            },
            {
                text: i18n.getKey('jobType'),
                dataIndex: 'singleJobConfig',
                width: 100,
                renderer: function (value, medate, record) {
                    return value ? value.jobType : null;
                }
            },
            {
                text: '必须的上下文',
                dataIndex: 'contextConfig',
                width: 200,
                xtype: 'componentcolumn',
                renderer: function (value, metadata, record) {
                    metadata.tdAttr = 'data-qtip="查看必须的上下文"';
                    if (!Ext.isEmpty(value)) {
                        return {
                            xtype: 'displayfield',
                            value: '<a href="#")>查看</a>',
                            listeners: {
                                render: function (display) {
                                    var a = display.el.dom.getElementsByTagName('a')[0]; //获取到该html元素下的a元素
                                    var ela = Ext.fly(a); //获取到a元素的element封装对象
                                    ela.on("click", function () {
                                        controller.showContext(value);
                                    });
                                }
                            }
                        };
                    }
                }
            },
            {
                text: i18n.getKey('page生成配置'),
                dataIndex: 'pages',
                flex: 1,
                xtype: 'componentcolumn',
                renderer: function (value, metadata, record) {
                    metadata.tdAttr = 'data-qtip="查看page生成配置"';
                    if (!Ext.isEmpty(value)) {
                        return {
                            xtype: 'displayfield',
                            value: '<a href="#")>查看</a>',
                            listeners: {
                                render: function (display) {
                                    var a = display.el.dom.getElementsByTagName('a')[0]; //获取到该html元素下的a元素
                                    var ela = Ext.fly(a); //获取到a元素的element封装对象
                                    ela.on("click", function () {
                                        controller.checkPageGenerateConfig(value);
                                    });
                                }
                            }
                        };
                    }
                }
            },
        ];
        me.callParent();
    }
})
