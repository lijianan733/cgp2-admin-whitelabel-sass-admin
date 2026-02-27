/**
 * @Description:
 * @author xiu
 * @date 2023/1/11
 */
Ext.syncRequire([
    'CGP.common.typesettingschedule.view.PageCreate',
    'CGP.common.typesettingschedule.view.NewPageCreate',
    'CGP.common.typesettingschedule.view.InsideStepBar',
    'CGP.common.typesettingschedule.view.LineContainer',
    'CGP.common.typesettingschedule.controller.Controller',
    'CGP.common.typesettingschedule.view.OptionalConfigContainer',
])
Ext.define('CGP.common.typesettingschedule.view.InteriorContainer', {
    extend: 'CGP.common.typesettingschedule.view.OptionalConfigContainer',
    alias: 'widget.interior_container',
    width: '100%',
    layout: 'vbox',
    initData: null,
    allowBlank: null,
    titleLabel: null,
    lineShow: false,
    initExpand: false,
    containerConfig:{
        defaults: {
            margin: '10 25 5 25',
            allowBlank: this.allowBlank,
        },
    },
    initComponent: function () {
        var me = this;
        var controller = Ext.create('CGP.common.typesettingschedule.controller.Controller');
        var data = me.initData;
        var subTasks = data['subTasks'][me.index];
        me.title = i18n.getKey(me.titleLabel);
        me.startTime = controller.getEndTime(subTasks['startTime']);
        me.endTime = controller.getEndTime(subTasks['endTime']);
        me.takeTime = ((new Date(+subTasks['endTime']) - new Date(+subTasks['startTime'])) / 1000).toFixed(0);
        me.containerItems = [
            {
                xtype: 'container',
                itemId: 'avv',
                layout: 'hbox',
                margin: '0 0 0 18',
                items: [
                    {
                        xtype: 'line_container',
                        itemId: 'lineContainer',
                        indexEnd: true,
                    },
                    {
                        xtype: 'inside_stepbar',
                        width: 35,
                        isOn: false,
                        direct: 'vbox',
                        itemId: 'stebar',
                        lineHeight: 80,
                        allowItemClick: false,
                        queryData: me.subTasksItem['stages'],
                    },
                    {
                        xtype: 'container',
                        width: 800,
                        layout: 'vbox',
                        defaults: {
                            margin: '10 0 0 0',
                        },
                        items: [
                            {
                                xtype: 'page_create',
                                initData: subTasks['stages'][0],
                                allowBlank: true,
                                index: 0,
                                titleLabel: i18n.getKey('page生成'),
                                listeners: {
                                    resize: function (comp) {
                                        var height = comp.getHeight();
                                        var avv = comp.ownerCt.ownerCt;
                                        var stebar = avv.getComponent('stebar')
                                        var initLine = stebar.getComponent('initLine')
                                        initLine.setHeight(height)
                                    }
                                }
                            },
                            {
                                xtype: 'page_create',
                                initData: subTasks['stages'][1],
                                index: 1,
                                allowBlank: true,
                                titleLabel: i18n.getKey('大版生成'),
                                listeners: {
                                    resize: function (comp) {
                                        var height = comp.getHeight();
                                        var avv = comp.ownerCt.ownerCt;
                                        var stebar = avv.getComponent('stebar')
                                        var typesettingLine = stebar.getComponent('typesettingLine')
                                        typesettingLine.setHeight(height)
                                    }
                                }
                            },
                            {
                                xtype: 'page_create',
                                initData: subTasks['stages'][2],
                                index: 2,
                                allowBlank: true,
                                titleLabel: i18n.getKey('分发大版'),
                            },
                        ]
                    }
                ],
            }
        ]
        me.callParent();
    }
})