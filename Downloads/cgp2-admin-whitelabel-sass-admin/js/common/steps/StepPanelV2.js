/**
 * @Description:
 * @author nan
 * @date 2023/6/16
 */
Ext.Loader.syncRequire([
    'CGP.common.steps.StepBarV2'
])
Ext.define('CGP.common.steps.StepPanelV2', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.step_panel_v2',
    layout: 'card',
    bodyStyle: {
        borderColor: 'silver'
    },
    defaults: {
        flex: 1,
        header: false,
    },
    stepDock: 'top',//导航栏的位置 top,left'
    stepBarCfg: null,//导航节点配置
    saveHandler: null,
    bbar: null,//底部工具条配置
    items: [],
    initComponent: function () {
        var me = this;
        me.dockedItems = [{
            itemId: 'stepDock',
            dock: me.stepDock,
            padding: 0,
            items: [
                Ext.Object.merge({
                    xtype: 'step_bar_v2',
                    itemId: 'stepDock',
                    layout: me.stepDock == 'top' ? 'hbox' : 'vbox',
                    width: me.stepDock == 'top' ? '100%' : 100,
                    height: me.stepDock == 'top' ? 100 : '100%',
                    allowItemClick: true,
                    allowClickChangeProcess: false,
                    listeners: {
                        activeChange: function (currentItem, oldItem) {
                            var me = this;
                            var panel = this.ownerCt.ownerCt;
                            console.log('activeChange');
                            var index = currentItem.index;
                            panel.getLayout().setActiveItem(index);
                            var bbar = panel.getDockedItems('toolbar[dock="bottom"]')[0];
                            var length = me.items.items.length;
                            bbar.getComponent('previous').setVisible(!(index == 0));
                            bbar.getComponent('next').setVisible(!(length - 1 == index));
                            bbar.getComponent('save').setVisible((length - 1 == index));
                        },
                        afterrender: function () {
                            var stepBar = this;
                            stepBar.setItemActive(stepBar.items.items[0]);
                        }
                    }
                }, me.stepBarCfg)
            ]
        }];
        var navigateCount = me.stepBarCfg.stepItemContainerArr.length;
        if (navigateCount > me.items.length) {
            for (; me.items.length < navigateCount;) {
                me.items.push({
                    xtype: 'panel',
                    items: [
                        {
                            xtype: 'textfield',
                            value: '空白panel_' + me.items.length
                        }
                    ]
                })
            }
        }
        me.bbar = Ext.Object.merge({
            xtype: 'bottomtoolbar',
            lastStepBtnCfg: {
                text: i18n.getKey('previousStep'),
                iconCls: 'icon_previous',
                itemId: 'previous',
                handler: function (btn) {
                    var panel = btn.ownerCt.ownerCt;
                    var toolbar = panel.getDockedItems('[itemId=stepDock]')[0];
                    var stepBar = toolbar.items.items[0];
                    var index = stepBar.process;
                   ;
                    stepBar.setProcess(index - 1, 1, null);
                    stepBar.fireEvent('activeChange', stepBar.items.items[index - 1], me.activeItem, me);
                }
            },
            saveBtnCfg: {
                text: i18n.getKey('nextStep'),
                iconCls: 'icon_next',
                itemId: 'next',
                handler: function (btn) {
                    var panel = btn.ownerCt.ownerCt;
                    var currentPanel = panel.getLayout().activeItem;
                    if (Ext.isEmpty(currentPanel.isValid) || (currentPanel.isValid && currentPanel.isValid())) {
                        var toolbar = panel.getDockedItems('[itemId=stepDock]')[0];
                        var stepBar = toolbar.items.items[0];
                        var index = stepBar.process;
                        stepBar.setProcess(index + 1, 1, null);
                        stepBar.fireEvent('activeChange', stepBar.items.items[index + 1], me.activeItem, me);
                    }
                }
            },
            cancelBtnCfg: {
                text: i18n.getKey('confirm'),
                iconCls: 'icon_save',
                hidden: true,
                itemId: 'save',
                handler: function (btn) {
                    var me = this;
                    var panel = me.ownerCt.ownerCt;
                    var toolbar = panel.getDockedItems('[itemId=stepDock]')[0];
                    var stepBar = toolbar.items.items[0];
                    panel.items.each(function (item, index, length) {
                        var isValid = item.isValid ? item.isValid() : true;
                        if (isValid == false) {
                            stepBar.fireEvent('itemClick', stepBar.items.items[index]);
                            return false;
                        }
                    })
                }
            }

        }, me.bbar);
        me.callParent();
    }
})