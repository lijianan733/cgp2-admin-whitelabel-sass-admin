/**
 * @Description:
 * @author xiu
 * @date 2023/1/11
 */
Ext.define('CGP.common.typesettingschedule.view.StepItemsBtn', {
    extend: 'Ext.Component',
    alias: 'widget.stepitems_btn',
    baseCls: '',
    animate: true,
    text: '',
    style: {},
    defaultClass: 'step-default-class',//默认样式
    failureClass: 'step-failure-class',//失败样式
    runningClass: 'step-running-class',//进行中样式
    finishedColor: {
        blur: '#409eff',
        green: 'green'
    },
    clickColor: null,
    finishColor: 'blur',
    status: -1,//状态，0失败,1成功,-1未执行
    itemCls: '',
    isShowLine: true,//是否显示中间的横线
    iconCls: 'step-icon',//默认的图标
    stepName: null,//步骤名
    stepDesc: null,//步骤描述
    index: null,//排列位置,
    handler: Ext.emptyFn,
    margin: '5px 0px',
    direct: 'vbox',//vbox垂直，hbox水平
    schedule: null,
    iconScale: 1,
    width: 35,
    renderTplVbox: [
        '<tpl>',
        '<div class="step-line-box {stepStatusCls}" style="display: inline-block;width: 50%;height: 100%;">',
        '<div class="{iconCls}" itemId="step-icon" style="width: {sizeWidth};height: {sizeWidth};">',
        '<div class="{classNameCls}" style="transform: scale({iconScale});margin: {iconMargin}">{schedule}</div>',

        '</div>',
        '</div>',
        '<tpl if="stepDesc">',
        '<div class="step-description">{stepDesc}</div>',
        '</tpl>',
        '</tpl>',
    ],
    initComponent: function () {
        var me = this;
        //执行后样式
        me.finishClass = `step-finish-${me.finishColor}-class`;
        me.stepLineCls = `step-finish-${me.finishColor}-line-bg`;
        me.statusColor = {
            finishedColor: me.finishedColor[me.finishColor],
            failureColor: 'red',
            defaultColor: '#999',
            clickColor: me.clickColor || this.finishedColor,
        }
        if (me.direct == 'vbox') {
            me.renderTpl = me.renderTplVbox;
        }
        this.callParent();
        this.addEvents(
            'change'
        );
    },
    initRenderData: function () {
        var me = this;
        var stepLineCls = null;
        var stepStatusCls = null;
        var classNameCls = {
            '-1': 'step-icon-bullets',
            '-2': 'step-icon-running',
            0: 'step-icon-failure',
            1: 'step-icon-success',
        }
        var scheduleNum = (me.status == '-2') ? `${me.schedule}%` : '';
        if (me.status == 0) {//失败
            stepStatusCls = me.failureClass;
            stepLineCls = null;
        } else if (me.status == 1) {//成功
            stepStatusCls = me.finishClass;
            stepLineCls = me.stepLineCls;
        } else if (me.status == -1) {//初始
            stepStatusCls = me.defaultClass;
            stepLineCls = null;
        } else if (me.status == -2) {//进行中
            stepStatusCls = me.runningClass;
            stepLineCls = null;
        }
        return {
            stepStatusCls: stepStatusCls,
            iconCls: 'step-icon',
            stepDesc: me.stepDesc,
            schedule: scheduleNum,
            classNameCls: classNameCls[me.status],
            sizeWidth: me.width + 'px',
            iconScale: me.iconScale,
            iconMargin: me.iconMargin || (me.status === -2 ?  (me.schedule <= 10 ? '3px 0 0 0' : '3px 0 0 -6px') : '0 0 0 0')

        };
    },
    onRender: function () {
        var me = this;
        me.callParent(arguments);
        var step_icon = Ext.fly(me.el.query('[itemId=step-icon]')[0]);
        step_icon.on('click', function () {
            me.fireEvent('itemClick', me);
        }, me);
        step_icon.on('click', me.handler, me);
    },
    updateTitle: function (text) {
        var me = this;
        me.el.query('[class=step-title]')[0].innerText = text;
    },
    setItemActive: function (active) {
        var me = this;

        var step_icon = Ext.fly(me.el.query('[itemId=step-icon]')[0]);
        if (active) {
            step_icon.setStyle({
                'scale': 1.5,
                'borderColor': me['statusColor']['clickColor']
            });
        } else {
            var actionColor = {
                '-1': me['statusColor']['defaultColor'],
                0: me['statusColor']['failureColor'],
                1: me['statusColor']['finishedColor']
            }
            step_icon.setStyle({
                'scale': 1,
                'borderColor': actionColor[me.status]
            });
        }

    },
    updateStatus: function (status) {
        var me = this;
        var stepLineCls = null;
        var stepStatusCls = null;
        me.status = status;
        if (status == 0) {//默认状态
            stepStatusCls = me.failureClass;
            stepLineCls = me.stepLineCls;
        } else if (status == 1) {//成功状态
            stepStatusCls = me.finishClass;
            stepLineCls = me.stepLineCls;
        } else if (status == -1) {//失败状态
            stepStatusCls = me.defaultClass;
            stepLineCls = null;
        }
        var box = Ext.fly(me.el.query('[class*=step-line-box]')[0]);
        box.removeCls([/*me.defaultClass,*/ me.failureClass, me.finishClass]);
        box.addCls(stepStatusCls);
        var line = Ext.fly(box.query('div:first-child')[0]);
        line.removeCls([me.stepLineCls]);
        line.addCls(stepLineCls);
    },
})