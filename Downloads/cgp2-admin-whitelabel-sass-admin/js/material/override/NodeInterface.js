Ext.define('CGP.material.override.NodeInterface', {
    override: 'Ext.data.NodeInterface',
    statics: {
        getPrototypeBody: function() {
            var result = this.callParent();

            result.filter = function(property, value, anyMatch, caseSensitive, matchParentNodes) {
                var filters = [];

                //support for the simple case of filtering by property/value
                if (Ext.isString(property)) {
                    filters.push(new Ext.util.Filter({
                        property: property,
                        value: value,
                        anyMatch: anyMatch,
                        caseSensitive: caseSensitive
                    }));
                } else if (Ext.isArray(property) || property instanceof Ext.util.Filter) {
                    filters = filters.concat(property);
                }

                // At this point we have an array of zero or more Ext.util.Filter objects to filter with,
                // so here we construct a function that combines these filters by ANDing them together
                // and filter by that.
                return this.filterBy(Ext.util.Filter.createFilterFn(filters), null, matchParentNodes);
            };

            result.filterBy = function(fn, scope, matchParentNodes) {
                var me = this,
                    newNode = me.copy(null, true),
                    matchedNodes = [],
                    allNodes = [],
                    markMatch, i;

                markMatch = function(node) {
                    node.filterMatch = true;
                    if (node.parentNode) {
                        markMatch(node.parentNode);
                    }
                };

                newNode.cascadeBy(function(node) {
                    allNodes.push(node);
                    if (fn.call(scope || me, node)) {
                        if (node.isLeaf() || matchParentNodes === true) {
                            matchedNodes.push(node);
                        }
                    }
                });

                for (i = 0; i < matchedNodes.length; i++) {
                    markMatch(matchedNodes[i])
                };

                for (i = 0; i < allNodes.length; i++) {
                    if (allNodes[i].filterMatch !== true) {
                        allNodes[i].remove();
                    }
                };

                return newNode;
            }

            return result;
        }
    }
});