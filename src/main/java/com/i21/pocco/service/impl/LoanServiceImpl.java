package com.i21.pocco.service.impl;

import com.i21.pocco.service.LoanService;
import com.i21.pocco.domain.Loan;
import com.i21.pocco.repository.LoanRepository;
import com.i21.pocco.service.dto.LoanDTO;
import com.i21.pocco.service.mapper.LoanMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

/**
 * Service Implementation for managing Loan.
 */
@Service
@Transactional
public class LoanServiceImpl implements LoanService {

    private final Logger log = LoggerFactory.getLogger(LoanServiceImpl.class);

    private final LoanRepository loanRepository;

    private final LoanMapper loanMapper;

    public LoanServiceImpl(LoanRepository loanRepository, LoanMapper loanMapper) {
        this.loanRepository = loanRepository;
        this.loanMapper = loanMapper;
    }

    /**
     * Save a loan.
     *
     * @param loanDTO the entity to save
     * @return the persisted entity
     */
    @Override
    public LoanDTO save(LoanDTO loanDTO) {
        log.debug("Request to save Loan : {}", loanDTO);

        Loan loan = loanMapper.toEntity(loanDTO);
        loan = loanRepository.save(loan);
        return loanMapper.toDto(loan);
    }

    /**
     * Get all the loans.
     *
     * @param pageable the pagination information
     * @return the list of entities
     */
    @Override
    @Transactional(readOnly = true)
    public Page<LoanDTO> findAll(Pageable pageable) {
        log.debug("Request to get all Loans");
        return loanRepository.findAll(pageable)
            .map(loanMapper::toDto);
    }


    /**
     * Get one loan by id.
     *
     * @param id the id of the entity
     * @return the entity
     */
    @Override
    @Transactional(readOnly = true)
    public Optional<LoanDTO> findOne(Long id) {
        log.debug("Request to get Loan : {}", id);
        return loanRepository.findById(id)
            .map(loanMapper::toDto);
    }

    /**
     * Delete the loan by id.
     *
     * @param id the id of the entity
     */
    @Override
    public void delete(Long id) {
        log.debug("Request to delete Loan : {}", id);
        loanRepository.deleteById(id);
    }
}
