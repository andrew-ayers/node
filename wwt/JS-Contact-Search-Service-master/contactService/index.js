// Start your code here!
// You should not need to edit any other existing files (other than if you would like to add tests)
// You do not need to import anything as all the necessary data and events will be delivered through
// updates and service, the 2 arguments to the constructor
// Feel free to add files as necessary

export default class {

    constructor(updates, service) {

        // Identifier lists for names and phone numbers
        // Used for update and search checking
        this.nameProps = ["firstName", "lastName", "nickName"];
        this.phoneNumberProps = ["primaryPhoneNumber", "secondaryPhoneNumber"];

        /* This is meant to be used as a set of "phone
         * number formatting filters", that work by using
         * a regex pattern matching to determing how to
         * convert the number into a consistent, numeric-
         * only format. For further explanation, see the
         * transformPhoneNumber() method, below.

        this.phoneFormats = [{
            // format = ###-###-####
            regex: /\d{3}-\d{3}-\d{4}/gm,
            transform: (phone) => {
                let parts = phone.split("-");

                return parts[0] + parts[1] + parts[2];
            }
        },{
            // format = +1##########
            regex: /\+1\d{10}/gm,
            transform: (phone) => phone.substring(phone.length - 10)
        }];
        */

        // For caching of contacts from service
        this.cache = [];

        // Cache the identified contact item when added
        updates.on('add', (id) => {
            service.getById(id).then((item) => {

                // Build the formatted name from the name parts
                let lastName = (item.lastName ? " " + item.lastName : "");
                
                // Full name is cached for later searching
                item.fullname = (item.firstName ? item.firstName : item.nickName) + lastName;
                
                // Name may be a nick name or full name
                item.name = (item.nickName ? item.nickName : item.firstName) + lastName;
                
                // Pre-transform the phone numbers
                item.primaryPhoneNumber = this.transformPhoneNumber(item.primaryPhoneNumber);
                item.secondaryPhoneNumber = this.transformPhoneNumber(item.secondaryPhoneNumber);

                this.cache.push(item);
            });
        });

        // Update the identified cache item when a contact field is changed
        updates.on('change', (id, property, value) => {
            this.cache = this.cache.map((item) => {
                if (item.id == id) {
                    item[property] = value;

                    // Update the formatted name if any of the name parts are updated
                    if (this.nameProps.includes(property)) {
                        // Build the formatted name from the name parts
                        let lastName = (item.lastName ? " " + item.lastName : "");
                        
                        // Full name is cached for later searching
                        item.fullname = (item.firstName ? item.firstName : item.nickName) + lastName;
                        
                        // Name may be a nick name or full name
                        item.name = (item.nickName ? item.nickName : item.firstName) + lastName;
                    }

                    if (this.phoneNumberProps.includes(property)) {
                        item[property] = this.transformPhoneNumber(item[property]);
                    }
                }

                return item;
            });
        });

        // Remove the identified cache item
        updates.on('remove', (id) => {
            this.cache = this.cache.filter((item) => {
                return (item.id == id) ? false : true;
            });
        });
    }

    // A somewhat "brute-force" method of converting phone
    // numbers...
    transformPhoneNumber(number) {
        number = number.replace(/\D/g, "");
        return number.substring(number.length - 10);

        /* The following routine works with the previously
         * defined property "phoneFormats", to implement a
         * more intelligent phone number transformation,
         * based on recognition of patterns using regex. 
         * 
         * I had initially investigated this system as a
         * possible way to filter and convert phone numbers,
         * and it still might be useful, but the above simpler
         * transform and filtering seem to handle all of the
         * existing test cases.
         * 
         * That said, it may not be ideal for all cases, and
         * there may be edge cases that break it. Ideally,
         * the routine below, and the definitions it relies
         * on, could be expanded to look for the patterns, 
         * and fall back on the "simple brute force" method
         * above if those don't meet the needs.

        if (!number) return number;
        for (let i = 0; i < this.phoneFormats.length; i++) {
            if (number.match(this.phoneFormats[i].regex)) {
                return this.phoneFormats[i].transform(number);
            }
        }
        */
    }

    search(query) {
        let results = this.cache.filter((item) => {
            // Return all cached results where the query string is
            // found in a property of the cached item
            for (var prop in item) {
                // Need to make sure that the property isn't one of prototype object
                // properties, so we don't accidentally match on 'em - see: 
                //
                // https://stackoverflow.com/a/16735184/5499217
                //
                if (Object.prototype.hasOwnProperty.call(item, prop)) {
                    // If we're searching the phone numbers, ignore special characters
                    let new_query = this.phoneNumberProps.includes(prop) ? query.replace(/\D/g, "") : query;

                    if (new_query && item[prop].includes(new_query)) {
                        return true;
                    }
                }
            }
        });

        // Return results from cache in simplified format
        return results.map((item) => {
            return {
                id: item.id,
                name: item.name,
                email: item.primaryEmail,

                // Build contact phone number list
                phones: [item.primaryPhoneNumber, item.secondaryPhoneNumber].filter(phone => phone != "").map((phone) => {
                    return "(" + phone.slice(0, 3) + ") " + phone.slice(3, 6) + "-" + phone.slice(6, 10);
                }),

                // Build formatted address string
                address: ((result) => {
                    let address = [];

                    if (result.addressLine1 &&
                        result.city &&
                        result.state &&
                        result.zipCode) {

                        address.push(result.addressLine1);

                        result.addressLine2 && address.push(result.addressLine2);
                        result.addressLine3 && address.push(result.addressLine3);

                        address.push(result.city + ", " + result.state + " " + result.zipCode);
                    }

                    return address.join("\n");
                })(item)                
            };
        });
    }
}