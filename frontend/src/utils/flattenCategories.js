export default (categories) => {
    const flattenedCategories = [];

    function flatten(category) {
        flattenedCategories.push({ name: category.name, id: category.id });

        if (category.subcategories) {
            category.subcategories.forEach(subcategory => {
                flatten(subcategory);
            });
        }
    }

    categories.forEach(category => {
        flatten(category);
    });

    return flattenedCategories;
}