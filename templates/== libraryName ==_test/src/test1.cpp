#include <iostream>
#include <<%= libraryName %>/<%= libraryName %>.h>
#include <gtest/gtest.h>

TEST(<%= libraryName %>_api_foobar, returns_the_correct_value) {
    ASSERT_EQ(12345, <%= libraryName %>_api());
}
