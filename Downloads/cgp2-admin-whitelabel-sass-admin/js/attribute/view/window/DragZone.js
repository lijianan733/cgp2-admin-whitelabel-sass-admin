Ext.define('CGP.attribute.view.window.DragZone', {
    override: 'Ext.view.DragZone',
    getDragData: function (e) {
        var view = this.view,
            item = e.getTarget(view.getItemSelector()),
            target = e.getTarget();

        // ADDED: Allow text selection to continue if not dragging anything other than the row numberer column
        if (target && target.className.indexOf('x-grid-cell-inner-row-numberer') == -1)
            return false;

        if (item) {
            return {
                copy: view.copy || (view.allowCopy && e.ctrlKey),
                event: e,
                view: view,
                ddel: this.ddel,
                item: item,
                records: view.getSelectionModel().getSelection(),
                fromPosition: Ext.fly(item).getXY()
            };
        }
    }
});