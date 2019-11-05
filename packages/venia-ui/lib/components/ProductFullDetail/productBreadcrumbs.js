import React, { useCallback, useMemo } from 'react';
import {
    ChevronDown as ChevronDownIcon,
    ChevronUp as ChevronUpIcon
} from 'react-feather';
import { useDropdown } from '@magento/peregrine';
import { mergeClasses } from '../../classify';
import Breadcrumbs from '../Breadcrumbs';
import Icon from '../Icon';
import defaultClasses from './productBreadcrumbs.css';

const ProductBreadcrumbs = props => {
    const classes = mergeClasses(defaultClasses, props.classes);
    const { product } = props;

    // We only want to render the child most node for breadcrumbs. The following
    // logic adds all breadcrumb ids to a set and then only returns data for
    // categories that _are not_ in that set.
    const breadcrumbSet = new Set();
    product.categories.forEach(({ breadcrumbs }) => {
        // breadcrumbs can be `null`...
        (breadcrumbs || []).forEach(({ category_id }) =>
            breadcrumbSet.add(category_id)
        );
    });

    // Filter out category data for categories that exist as breadcrumbs.
    const breadcrumbData = product.categories.filter(
        category => !breadcrumbSet.has(category.id)
    );

    const breadcrumbList = useMemo(
        () =>
            breadcrumbData.map(category => {
                const { name, url_path, breadcrumbs } = category;
                return (
                    <Breadcrumbs
                        key={name}
                        currentCategory={name}
                        currentPath={url_path}
                        data={breadcrumbs}
                    />
                );
            }),
        [breadcrumbData]
    );

    const { elementRef, expanded, setExpanded } = useDropdown();

    const handleBreadcrumbClick = useCallback(() => {
        setExpanded(!expanded);
    }, [expanded, setExpanded]);

    const breadcrumbs =
        breadcrumbList.length > 1 ? (
            <div className={classes.breadcrumbRoot} ref={elementRef}>
                <button
                    className={classes.breadcrumbListButton}
                    onClick={handleBreadcrumbClick}
                >
                    {'Categories related to this product'}
                    <Icon src={expanded ? ChevronUpIcon : ChevronDownIcon} />
                </button>
                <span
                    className={
                        expanded ? classes.dropdown_open : classes.dropdown
                    }
                >
                    {breadcrumbList}
                </span>
            </div>
        ) : (
            breadcrumbList
        );

    return breadcrumbs;
};

export default ProductBreadcrumbs;

ProductBreadcrumbs.propTypes = {
    // TODO:
};
