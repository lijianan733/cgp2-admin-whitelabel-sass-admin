/**
 * @author xiu
 * @date 2024/12/31
 */
Ext.define('CGP.currencyconfig.view.CreateEffectDateComp', {
    extend: 'Ext.ux.form.field.UxFieldContainer',
    alias: 'widget.createEffectDateComp',
    defaults: {},
    showCompName: 'one',
    topComp: null,
    nextEffectiveSettingId: null,
    initComponent: function () {
        var me = this,
            controller = Ext.create('CGP.currencyconfig.controller.Controller')

        me.items = [
            {
                xtype: 'displayfield',
                fieldLabel: i18n.getKey('配置生效时间'),
                itemId: 'one',
                width: 400,
                value: '2024/01/01 00:00:00'
            },
            {
                xtype: 'uxfieldcontainer',
                itemId: 'two',
                defaults: {},
                layout: 'hbox',
                labelAlign: 'left',
                margin: '0 0 0 0',
                width: 600,
                fieldLabel: i18n.getKey('配置生效时间'),
                diySetValue: function (data) {
                    var me = this,
                        showTime = me.getComponent('showTime');
                    if (data) {
                        console.log(data)
                        showTime.setValue(data);
                    }
                },
                items: [
                    {
                        xtype: 'displayfield',
                        itemId: 'showTime',
                        margin: '0 10 0 0',
                        value: '2024/01/01 00:00:00 → 2024/12/31 23:59:59'
                    },
                    {
                        xtype: 'atag_displayfield',
                        tooltip: '查看_即将生效配置',
                        value: i18n.getKey('即将生效配置'),
                        clickHandler: function (value, metaData, record) {
                            JSOpen({
                                id: 'checkEffectConfigPanel',
                                url: path + `partials/currencyconfig/checkEffectConfigPanel.html` +
                                    `?_id=${me.nextEffectiveSettingId}&websiteId=${me.topComp.websiteId}&websiteMode=${me.topComp.websiteMode}`,
                                refresh: true,
                                title: i18n.getKey('查看_即将生效货币配置<' + me.nextEffectiveSettingId + '>')
                            });
                        }
                    },
                ]
            },
            {
                xtype: 'uxfieldcontainer',
                itemId: 'three',
                defaults: {
                    margin: '0 0 0 0',
                },
                layout: 'hbox',
                labelAlign: 'left',
                margin: '0 0 0 0',
                width: 600,
                fieldLabel: i18n.getKey('配置生效时间'),
                diySetValue: function (data) {
                    var me = this,
                        effectiveModeComp = me.getComponent('effectiveMode'),
                        effectiveTimeComp = me.getComponent('effectiveTime');

                    if (data) {
                        var {effectiveTime, effectiveMode} = data;
                        effectiveMode && effectiveModeComp.setValue({
                            effectiveMode: effectiveMode
                        });
                        effectiveTime && effectiveTimeComp.setValue(new Date(+effectiveTime));
                    }
                },
                diyGetValue: function () {
                    var me = this,
                        effectiveModeComp = me.getComponent('effectiveMode'),
                        effectiveTimeComp = me.getComponent('effectiveTime'),
                        effectiveModeValue = effectiveModeComp.getValue()['effectiveMode'],
                        effectiveTimeValue = effectiveTimeComp.getValue()?.getTime() || (new Date().getTime() + (2 * 60 * 1000)),
                        result = {
                            effectiveMode: effectiveModeValue,
                        }

                    if (effectiveModeValue === 'DELAY') {
                        result['effectiveTime'] = effectiveTimeValue;
                    }

                    return result
                },
                items: [
                    {
                        xtype: 'radiogroup',
                        itemId: 'effectiveMode',
                        width: 200,
                        defaults: {
                            width: 100,
                            margin: '0 0 0 0',
                        },
                        items: [
                            {
                                boxLabel: '即时生效',
                                name: 'effectiveMode',
                                inputValue: 'DIRECT',
                                checked: true,
                            },
                            {
                                boxLabel: '延时生效',
                                name: 'effectiveMode',
                                inputValue: 'DELAY'
                            }
                        ],
                        listeners: {
                            change: function (combo, newValue) {
                                var container = combo.ownerCt,
                                    effectiveTime = container.getComponent('effectiveTime'),
                                    typeGather = {
                                        DIRECT: false,
                                        DELAY: true
                                    },
                                    {effectiveMode} = newValue,
                                    isShow = typeGather[effectiveMode];

                                effectiveTime.setVisible(isShow);
                                effectiveTime.setDisabled(!isShow);
                            }
                        }
                    },
                    {
                        xtype: 'datetimefield',
                        name: 'effectiveTime',
                        itemId: 'effectiveTime',
                        margin: '0 0 0 20',
                        editable: false,
                        hidden: true,
                        disabled: true,
                        width: 170,
                        format: 'Y-m-d H:i:s',
                        allowBlank: false,
                        minValue: new Date(),
                    }
                ]
            },
        ]

        me.callParent();
        me.on('afterrender', function () {
            me.setShowType(me.showCompName);
        });
    },
    diySetValue: function (data) {
        var me = this,
            {effectiveTime, expiredTime, nextEffectiveSettingId, effectiveMode} = data,
            controller = Ext.create('CGP.currencyconfig.controller.Controller'),
            effectiveTimeValue = controller.getEndTime(effectiveTime),
            expiredTimeValue = controller.getEndTime(expiredTime),
            showCompNameGather = {
                one: function () {
                    var oneComp = me.getComponent('one');
                    oneComp.setValue(effectiveTimeValue);
                },
                two: function () {
                    var twoComp = me.getComponent('two'),
                        text = `${effectiveTimeValue} → ${expiredTimeValue}`;

                    twoComp.diySetValue(text);
                    me.nextEffectiveSettingId = nextEffectiveSettingId;
                },
                three: function () {
                    var threeComp = me.getComponent('three');

                    threeComp.diySetValue({
                        effectiveTime,
                        effectiveMode
                    });
                },
            }

        showCompNameGather[me.showCompName]();
    },
    diyGetValue: function () {
        var me = this,
            threeComp = me.getComponent('three');

        return threeComp.diyGetValue();
    },
    setShowType: function (showCompName) {
        var me = this,
            showComp = me.getComponent(showCompName),
            compNames = ['one', 'two', 'three'];

        me.showCompName = showCompName;
        compNames.forEach(item => {
            var comp = me.getComponent(item);
            comp.setVisible(false);
            comp.setDisabled(true);
        })
        showComp.setVisible(true);
        showComp.setDisabled(false);
    }
})