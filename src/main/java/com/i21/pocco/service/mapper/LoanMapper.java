package com.i21.pocco.service.mapper;

import com.i21.pocco.domain.*;
import com.i21.pocco.service.dto.LoanDTO;

import org.mapstruct.*;

/**
 * Mapper for the entity Loan and its DTO LoanDTO.
 */
@Mapper(componentModel = "spring", uses = {CustomerMapper.class})
public interface LoanMapper extends EntityMapper<LoanDTO, Loan> {

    @Mapping(source = "customer.id", target = "customerId")
    LoanDTO toDto(Loan loan);

    @Mapping(source = "customerId", target = "customer")
    Loan toEntity(LoanDTO loanDTO);

    default Loan fromId(Long id) {
        if (id == null) {
            return null;
        }
        Loan loan = new Loan();
        loan.setId(id);
        return loan;
    }
}
