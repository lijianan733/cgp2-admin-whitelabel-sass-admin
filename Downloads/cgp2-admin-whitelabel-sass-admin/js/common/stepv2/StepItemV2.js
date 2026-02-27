/**
 * @Description:
 * @author nan
 * @date 2023/6/14
 */
Ext.define('CGP.common.stepv2.StepItemV2', {
    extend: 'Ext.Component',
    alias: 'widget.step_item_v2',
    stepTitle: null,
    stepIconCls: 'step-icon-v2',
    defaultClass: 'step-default-class-v2',//默认样式 0
    failureClass: 'step-failure-class-v2',//失败样式 -1
    successClass: 'step-success-class-v2',//成功样式 1
    activeClass: 'step-active-class-v2',//激活的样式 暂时没用到
    doingClass: 'step-doing-class-v2',//执行中的样式
    stepSize: 30,
    height: 30,
    width: 30,
    index: null,//排列位置,
    status: 0,//状态，-1失败,1成功,0未执行 2执行中
    active: false,//是否处于激发状态
    handler: Ext.emptyFn,
    margin: '5px 0px',
    renderTpl: [
        '<tpl>',
        '<div class="steps-center step-icon-container">',
        '<div class="{stepIconCls} {stepStatusCls}" itemId="step-icon-v2">',
        '<div class="step-icon-bullets-v2">' +
        '<div class="step_index" style="font-size: large;line-height: 24px"> {[values.setStepIcon()]}</div>' +
        '</div>',
        '</div>',
        '</div>',
        '</tpl>',
    ],
    initComponent: function () {
        var me = this;
        //执行后样式
        this.callParent();
        this.addEvents(
            'beforeItemClick',
            'itemClick',
            'statusChange'
        );
    },
    /**
     *
     */
    onRender: function () {
        var me = this;
        me.callParent(arguments);
        var step_icon = Ext.fly(me.el.query('[itemId=step-icon-v2]')[0]);
        step_icon.on('click', function () {
            if (me.fireEvent('beforeItemClick', me) == false) {
                console.log('beforeItemClick');
            } else {
                me.fireEvent('itemClick', me);
                me.handler(me);
            }
        }, me);
    },
    /**
     * 返回模板的上下文
     */
    initRenderData: function () {
        var me = this;
        var stepLineCls = null;
        var stepStatusCls = null;
        if (me.status == 0) {//初始
            stepStatusCls = me.defaultClass;
            stepLineCls = null;
        } else if (me.status == 1) {//成功
            stepStatusCls = me.successClass;
        } else if (me.status == -1) {//失败
            stepStatusCls = me.failureClass;
        } else if (me.status == 2) {//执行中
            stepStatusCls = me.doingClass;
        }
        return {
            stepStatusCls: stepStatusCls,
            stepLineCls: stepLineCls,//'step-finish-line-bg'
            status: me.status,//状态，0或1
            itemCls: '',
            isShowLine: me.isShowLine,
            stepIconCls: me.stepIconCls,
            stepName: me.stepName,
            stepDesc: me.stepDesc,
            stepTitle: me.stepTitle,
            stepSize: me.stepSize,
            index: me.index,
            setStepIcon: me.setStepIcon
        };
    },
    setStepIcon: function () {
        var me = this;
        if (me.status == 0 || me.status == 2) {
            return me.index + 1;
        } else if (me.status == 1) {
            return '✔';
        } else if (me.status == -1) {
            return '✖'
        }
    },
    /**
     * item设置样式为突出样式
     * @param active
     */
    setItemActive: function (active) {
        var me = this;
        var step_icon = Ext.fly(me.el.query('[itemId=step-icon-v2]')[0]);
        if (active) {
            step_icon.setStyle({
                'scale': 1.2,
            });
        } else {
            step_icon.setStyle({
                'scale': 1,
            });
        }
    },
    updateStatus: function (status) {
        var me = this;
        var oldStatus = me.status;
        me.status = status;
        var box = Ext.fly(me.el.query('[class*=step-icon-v2]')[0]);
        box.removeCls([me.defaultClass, me.successClass, me.failureClass, me.doingClass]);
        if (status == 0) {//默认状态
            box.addCls(me.defaultClass);
        } else if (status == 1) {//成功状态
            box.addCls(me.successClass);
        } else if (status == -1) {//失败状态
            box.addCls(me.failureClass);
        } else if (status == 2) {//执行中的状态
            box.addCls(me.doingClass);
        }
        me.el.query('[class=step_index]')[0].innerText = me.setStepIcon();
        if (oldStatus != status) {
            me.fireEvent('statusChange', me, oldStatus, status);
        }
    },
})