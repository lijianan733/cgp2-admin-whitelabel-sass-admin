/**
 * @Description:
 * @author xiu
 * @date 2023/1/11
 */
Ext.syncRequire([
    'CGP.common.typesettingschedule.view.InsideStepBar',
    'CGP.common.typesettingschedule.view.NewInsideStepBar',
    'CGP.common.typesettingschedule.view.LineContainer',
    'CGP.common.typesettingschedule.controller.Controller',
    'CGP.common.typesettingschedule.view.OptionalConfigContainer',
])
Ext.define('CGP.common.typesettingschedule.view.NewInteriorContainer', {
    extend: 'CGP.common.typesettingschedule.view.OptionalConfigContainer',
    alias: 'widget.new_interior_container',
    width: '100%',
    layout: 'vbox',
    initData: null,
    allowBlank: null,
    titleLabel: null,
    lineShow: false,
    initExpand: false,
    containerConfig: {
        defaults: {
            margin: '10 25 5 25',
            allowBlank: this.allowBlank,
        },
    },
    initComponent: function () {
        var me = this,
            data = me.initData,
            controller = Ext.create('CGP.common.typesettingschedule.controller.Controller');

        if (me.index === 2){ //在分发大版时执行
            me.title = i18n.getKey(me.titleLabel);
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
                            xtype: 'new_inside_stepbar',
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
                                    xtype: 'new_page_create',
                                    initData: data['stages'][0],
                                    allowBlank: true,
                                    index: 0,
                                    titleLabel: i18n.getKey('生成档案'),
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
                                    xtype: 'new_page_create',
                                    initData: data['stages'][1],
                                    allowBlank: true,
                                    index: 0,
                                    titleLabel: i18n.getKey('传输档案'),
                                },
                            ]
                        }
                    ],
                }
            ]
        }

        me.callParent();
    }
})