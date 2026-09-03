export function groupMealsByCategory(meals) {
    return meals.reduce((groups, meal) => {
        const category = meal.category

        if(!groups[category]){
            groups[category] = [];
        }

        groups[category].push(meal);

        return groups;
    }, {})
}