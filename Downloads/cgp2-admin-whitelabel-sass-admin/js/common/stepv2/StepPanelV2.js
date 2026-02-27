/**
 * @Description:
 * @author nan
 * @date 2023/6/16
 */
Ext.Loader.syncRequire([
    'CGP.common.stepv2.StepBarV2'
])
Ext.define('CGP.common.stepv2.StepPanelV2', {
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
    stepOuterToolBarCfg: null,//步骤栏组件外围的dockBar组件配置
    stepDock: 'top',//导航栏的位置 top,left'
    stepBarCfg: null,//导航节点配置
    saveHandler: null,
    bbar: null,//底部工具条配置
    /**
     * items:[{
     *     isValid 当前页面是否校验通过
     *     initData 点击下一步后，对下一个页面进行赋值初始化的方法
     *     diyGetValue||getValue 获取当前页面的数据
     * }]
     */
    items: [],
    /**
     *
     */
    /**
     * 设置进度，显示对应的Panel
     */
    setProcess: function (process, status = 1) {
        var panel = this;
        var currentPanel = panel.getLayout().activeItem;
        var toolbar = panel.getDockedItems('[itemId=stepDock]')[0];
        var stepBar = toolbar.items.items[0];
        stepBar.setProcess(process, status, null);
        stepBar.fireEvent('activeChange', stepBar.items.items[process], currentPanel, panel);
        panel.fireEvent('activeChange', stepBar.items.items[process], currentPanel, panel);

        //输出页面数据
        var data = null;
        if (currentPanel.diyGetValue) {
            data = currentPanel.diyGetValue();
        } else if (currentPanel.getValue) {
            data = currentPanel.getValue();
        }
        console.log(data)
    },
    getNextPanel: function () {
        return this.getLayout().getNext();
    },
    getPrePanel: function () {
        return this.getLayout().getPrev();
    },
    getPanelByIndex: function (index) {
        return this.items.items[index];
    },
    getCurrentPanel: function () {
        return this.getLayout().getActiveItem();
    },
    initComponent: function () {
        var me = this;
        me.dockedItems = [Ext.Object.merge({
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
                            panel.getLayout().setActiveItem(index);//设置哪个panel显示
                            var bbar = panel.getDockedItems('toolbar[dock="bottom"]')[0];
                            var length = me.items.items.length;
                            bbar.getComponent('previous').setVisible(!(index == 0));
                            bbar.getComponent('next').setVisible(!(length - 1 == index));
                            bbar.getComponent('save').setVisible((length - 1 == index));

                        },
                    }
                }, me.stepBarCfg)
            ]
        }, me.stepOuterToolBarCfg)];
        var navigateCount = me.stepBarCfg.stepItemContainerArr.length;
        if (navigateCount > me.items.length) {
            for (; me.items.length < navigateCount;) {
                me.items.push({
                    xtype: 'panel',
                    items: [
                        {
                            xtype: 'textfield',
                            value: '空白panel_' + me.items.length,
                            fieldLabel: i18n.getKey('空白表')
                        }
                    ]
                })
            }
        }
        me.items.map(function (item, index) {
            item.index = index;
        });
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
                    panel.setProcess(Math.min(index - 1, stepBar.items.items.length), 2)
                }
            },
            saveBtnCfg: {
                text: i18n.getKey('nextStep'),
                iconCls: 'icon_next',
                itemId: 'next',
                handler: function (btn) {
                    var panel = btn.ownerCt.ownerCt;
                    var currentPanel = panel.getLayout().activeItem;
                    var nextPanel = null;
                    if (Ext.isEmpty(currentPanel.isValid) || (currentPanel.isValid && currentPanel.isValid())) {
                        JSSetLoading(true);
                        setTimeout(function () {
                            var toolbar = panel.getDockedItems('[itemId=stepDock]')[0];
                            var stepBar = toolbar.items.items[0];
                            var index = Math.max(stepBar.process + 1, 0);
                            var nextPanel = panel.getPanelByIndex(index);
                            panel.setProcess(index, 2);
                            //显示后进行初始化设置
                            nextPanel.initData ? nextPanel.initData() : console.log('无处理');
                            JSSetLoading(false);
                        }, 250);
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
                    var isValid = true;
                    panel.items.each(function (item, index, length) {
                        isValid = item.isValid ? item.isValid() : true;
                        if (isValid == false) {
                            stepBar.fireEvent('itemClick', stepBar.items.items[index]);
                            return false;
                        }
                    })
                    if (isValid) {
                        panel.saveHandler ? panel.saveHandler() : null;
                    }
                }
            }

        }, me.bbar);
        me.callParent();
        me.on('afterrender', function () {
            var me = this;
            me.setProcess(0, 2);
        })
    },
    setValue: function () {
        var me = this;
    },
    getValue: function () {
        var me = this;
    }
})